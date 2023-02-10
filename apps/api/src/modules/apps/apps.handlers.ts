import { Prisma } from "@prisma/client";
import {
    uniqueNamesGenerator,
    adjectives,
    animals,
    NumberDictionary,
    Config,
} from "unique-names-generator";

import { RouteHandlerMethodTypebox } from "../../types";
import { CreateAppSchema, GetAppSchema, ListAppSchema } from "./apps.schemas";

/**
 * Name generator, generate names like `lazy-pig-345`
 */
const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
const nameGeneratorConfig: Config = {
    dictionaries: [adjectives, animals, numberDictionary],
    separator: "-",
};

export const createHandler: RouteHandlerMethodTypebox<
    typeof CreateAppSchema
> = async (request, reply) => {
    const user = await request.prisma.user.findFirst({
        where: {
            subs: {
                has: request.user.sub,
            },
        },
    });

    // logged in user
    if (!user) {
        return reply.code(401).send();
    }

    // name of application
    const name = request.body.name ?? uniqueNamesGenerator(nameGeneratorConfig);

    // XXX: validate with pattern /^[a-z][a-z0-9-]{1,28}[a-z0-9]$/

    // find organization by slug
    const organization = request.body.org
        ? await request.prisma.organization.findFirst({
              where: {
                  slug: request.body.org,
                  members: {
                      some: {
                          user: {
                              subs: {
                                  has: request.user.sub,
                              },
                          },
                      },
                  },
              },
          })
        : undefined;

    if (organization === null) {
        return reply.code(400).send({
            statusCode: 400,
            error: "Error",
            message: `Invalid organization '${name}'`,
        });
    }

    try {
        // create application, connected to organization
        const app = await request.prisma.application.create({
            data: {
                name,
                creatorId: user.id,
                organizationId: organization?.id,
            },
        });

        return reply.code(200).send({
            name: app.name,
        });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                const fields = e.meta?.target as string[];
                const message = `Application with same ${fields
                    .map((f) => `'${f}'`)
                    .join(" and ")} already exists`;
                return reply.code(400).send({
                    statusCode: 400,
                    error: e.code,
                    message: message,
                });
            }
        }
    }
};

export const listHandler: RouteHandlerMethodTypebox<
    typeof ListAppSchema
> = async (request, reply) => {
    const apps = request.query.org
        ? await request.prisma.application.findMany({
              where: {
                  organization: {
                      slug: request.query.org,
                      members: {
                          some: {
                              user: {
                                  subs: {
                                      has: request.user.sub,
                                  },
                              },
                          },
                      },
                  },
              },
          })
        : await request.prisma.application.findMany({
              where: {
                  creator: {
                      subs: {
                          has: request.user.sub,
                      },
                  },
                  organizationId: null,
              },
          });
    return reply.code(200).send(apps);
};

export const getHandler: RouteHandlerMethodTypebox<
    typeof GetAppSchema
> = async (request, reply) => {
    // search by name of application, where user must be creator or member of application organization
    const dapp = await request.prisma.application.findFirst({
        where: {
            name: request.params.name,
            OR: {
                organization: {
                    members: {
                        some: {
                            user: {
                                subs: {
                                    has: request.user.sub,
                                },
                            },
                        },
                    },
                },
                creator: {
                    subs: {
                        has: request.user.sub,
                    },
                },
            },
        },
    });

    if (!dapp) {
        return reply.code(404);
    }
    return reply.code(200).send(dapp);
};
