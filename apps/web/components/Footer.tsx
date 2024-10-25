import {
    Anchor,
    Container,
    Grid,
    GridCol,
    Group,
    Paper,
    Stack,
} from "@mantine/core";
import Link from "next/link";
import { Logo } from "./Logo/Logo";

import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";

export function Footer() {
    const items = [
        {
            label: "Cartesi.io",
            href: "https://cartesi.io/",
        },
        {
            label: "Cartesi Docs",
            href: "https://docs.cartesi.io/",
            external: true,
        },
        {
            label: "ETH Global Guide",
            href: "https://github.com/Mugen-Builders/cartesi-avail-tutorial",
            external: true,
        },
    ];

    const social = [
        {
            label: "GitHub",
            href: "https://github.com/cartesi",
            external: true,
            icon: <IconBrandGithub />,
        },
        /*{
      label: 'Discord',
      href: '#',
      external: true,
    },*/
        {
            label: "X",
            href: "https://twitter.com/cartesiproject",
            external: true,
            icon: <IconBrandX />,
        },
    ];

    return (
        <Paper
            bg="black"
            c="white"
            component="footer"
            radius={0}
            py={{
                base: "xl",
                sm: "2xl",
            }}
        >
            <Container>
                <Grid>
                    <GridCol span={{ base: 12, sm: 4 }}>
                        <Logo isDark />
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 4 }}>
                        <Stack>
                            {items.map(({ href, label, external }) => (
                                <Anchor
                                    fz="sm"
                                    c="white"
                                    component={Link}
                                    href={href}
                                    key={label}
                                    target={external ? "_blank" : ""}
                                    rel={external ? "noopener noreferrer" : ""}
                                >
                                    {label}
                                </Anchor>
                            ))}
                        </Stack>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 4 }}>
                        <Group gap={"lg"}>
                            {social.map(({ href, label, external, icon }) => (
                                <Anchor
                                    fz="sm"
                                    c="white"
                                    component={Link}
                                    href={href}
                                    key={label}
                                    target={external ? "_blank" : ""}
                                    rel={external ? "noopener noreferrer" : ""}
                                >
                                    {icon}
                                </Anchor>
                            ))}
                        </Group>
                    </GridCol>
                </Grid>
            </Container>
        </Paper>
    );
}
