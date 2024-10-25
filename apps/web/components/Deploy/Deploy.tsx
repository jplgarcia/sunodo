import { Stack, Title } from "@mantine/core";
import { FC, useState } from "react";

import { HostingMethod } from "./Hosting";
import DeploySelfHosted from "./SelfHosted/DeploySelfHosted";

type DeployProps = {
    cid?: string;
    provider?: string;
    templateHash?: string;
};

const Deploy: FC<DeployProps> = (props) => {
    const defaultMethod = props.templateHash
        ? "self-hosted"
        : props.cid
          ? "third-party"
          : undefined;
    const [method, setMethod] = useState<HostingMethod | undefined>(
        defaultMethod,
    );

    return (
        <Stack maw={960} gap="xl" pb="xl">
            <Title order={3}>Deploy</Title>
            <DeploySelfHosted templateHash={props.templateHash} />
        </Stack>
    );
};

export default Deploy;
