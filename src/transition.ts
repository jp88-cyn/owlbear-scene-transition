import OBR, {
    buildEffect
} from "@owlbear-rodeo/sdk";

export const TRANSITION_KEY =
    "jp-aleatorio/scene-transition";

let effectId: string | null = null;
let effectInterval: number | null = null;

/*
 * Tons inspirados no Midnight Channel
 */

const SHADER_A = `
half4 main(float2 coord) {
    return half4(
        0.05,
        0.10,
        0.25,
        1.0
    );
}
`;

const SHADER_B = `
half4 main(float2 coord) {
    return half4(
        0.15,
        0.20,
        0.40,
        1.0
    );
}
`;

async function removerEffect() {

    if (effectId) {

        await OBR.scene.local.deleteItems([
            effectId
        ]);

        effectId = null;

        console.log(
            "Effect removido."
        );
    }
}

async function criarEffect(
    shader: string
) {

    const effect =
        buildEffect()
            .effectType(
                "VIEWPORT"
            )
            .sksl(
                shader
            )
            .build();

    effectId =
        effect.id;

    await OBR.scene.local.addItems([
        effect
    ]);

    console.log(
        "Effect criado."
    );
}

async function iniciarMidnightChannel() {

    /*
     * Evita duplicar animações
     */

    if (effectInterval !== null) {
        return;
    }

    console.log(
        "Iniciando Midnight Channel..."
    );

    let usarPrimeiro =
        true;

    /*
     * Cria o primeiro efeito
     */

    await criarEffect(
        SHADER_A
    );

    effectInterval =
        window.setInterval(
            async () => {

                await removerEffect();

                await criarEffect(

                    usarPrimeiro
                        ? SHADER_B
                        : SHADER_A

                );

                usarPrimeiro =
                    !usarPrimeiro;

            },

            300
        );
}

async function pararMidnightChannel() {

    console.log(
        "Parando Midnight Channel..."
    );

    if (
        effectInterval !== null
    ) {

        clearInterval(
            effectInterval
        );

        effectInterval =
            null;
    }

    await removerEffect();
}

async function atualizarEfeito(
    ativa: boolean | undefined
) {

    if (!ativa) {

        await pararMidnightChannel();

        return;
    }

    await iniciarMidnightChannel();
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
     * Verifica o estado atual
     * para quem entrar depois.
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