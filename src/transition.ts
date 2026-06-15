import OBR, {
    buildEffect
} from "@owlbear-rodeo/sdk";

export const TRANSITION_KEY =
    "jp-aleatorio/scene-transition";

let effectId: string | null = null;

const BLACK_SHADER = `
half4 main(float2 coord) {
    return half4(0.0, 0.0, 0.0, 1.0);
}
`;

async function atualizarEfeito(
    ativa: boolean | undefined
) {

    /*
     * Remover efeito
     */

    if (!ativa) {

        if (effectId) {

            await OBR.scene.local.deleteItems([
                effectId
            ]);

            effectId = null;

            console.log(
                "Effect removido."
            );
        }

        return;
    }

    /*
     * Evita criar efeitos duplicados
     */

    if (effectId) {

        return;
    }

    /*
     * Criar efeito
     */

    const effect =
        buildEffect()
            .effectType(
                "VIEWPORT"
            )
            .sksl(
                BLACK_SHADER
            )
            .build();

    effectId =
        effect.id;

    await OBR.scene.local.addItems([
        effect
    ]);

    console.log(
        "Effect criado!"
    );
}

OBR.onReady(async () => {

    console.log(
        "Transition Effect pronto!"
    );

    const role =
        await OBR.player.getRole();

    console.log(
        "Cargo no transition:",
        role
    );

    /*
     * O GM não recebe os efeitos.
     */

    if (role === "GM") {

        console.log(
            "GM detectado. Ignorando efeitos."
        );

        return;
    }

    /*
     * Escuta mudanças futuras imediatamente.
     */

    OBR.room.onMetadataChange(
        async (metadata) => {

            const data =
                metadata[
                    TRANSITION_KEY
                ] as
                    | {
                        ativa: boolean;
                    }
                    | undefined;

            console.log(
                "Metadata recebida:",
                data
            );

            await atualizarEfeito(
                data?.ativa
            );

        }
    );

    /*
     * Depois verifica o estado atual
     * para jogadores que acabaram de entrar.
     */

    const metadataAtual =
        await OBR.room.getMetadata();

    const dadosAtuais =
        metadataAtual[
            TRANSITION_KEY
        ] as
            | {
                ativa: boolean;
            }
            | undefined;

    console.log(
        "Estado inicial:",
        dadosAtuais
    );

    await atualizarEfeito(
        dadosAtuais?.ativa
    );

});