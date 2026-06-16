import OBR, {
    buildEffect
} from "@owlbear-rodeo/sdk";

export const TRANSITION_KEY =
    "jp-aleatorio/scene-transition";

let effectId: string | null = null;

let videoOverlay: HTMLDivElement | null =
    null;

let overlayVideo: HTMLVideoElement | null =
    null;

/*
 * Shader da tela preta
 */

const BLACK_SHADER = `
half4 main(float2 coord) {
    return half4(
        0.0,
        0.0,
        0.0,
        1.0
    );
}
`;

async function removerTelaPreta() {

    if (effectId) {

        await OBR.scene.local.deleteItems([
            effectId
        ]);

        effectId = null;

        console.log(
            "Tela preta removida."
        );
    }
}

async function criarTelaPreta() {

    if (effectId) {
        return;
    }

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
        "Tela preta criada."
    );
}

function removerVideo() {

    if (overlayVideo) {

        overlayVideo.pause();

        overlayVideo.src = "";
    }

    if (videoOverlay) {

        videoOverlay.remove();
    }

    overlayVideo = null;
    videoOverlay = null;

    console.log(
        "Vídeo removido."
    );
}

function criarVideo(
    url: string
) {

    removerVideo();

    console.log(
        "Criando vídeo com URL:",
        url
    );

    videoOverlay =
        document.createElement("div");

    videoOverlay.style.position =
        "fixed";

    videoOverlay.style.top =
        "0";

    videoOverlay.style.left =
        "0";

    videoOverlay.style.width =
        "100vw";

    videoOverlay.style.height =
        "100vh";

    videoOverlay.style.zIndex =
        "999999";

    videoOverlay.style.background =
        "black";

    overlayVideo =
        document.createElement("video");

    overlayVideo.src =
        url;

    overlayVideo.autoplay =
        true;

    overlayVideo.loop =
        true;

    overlayVideo.playsInline =
        true;

    overlayVideo.controls =
        false;

    overlayVideo.muted =
        true;

    overlayVideo.style.width =
        "100%";

    overlayVideo.style.height =
        "100%";

    overlayVideo.style.objectFit =
        "cover";

    overlayVideo.addEventListener(
        "contextmenu",
        (event) => {

            event.preventDefault();

        }
    );

    videoOverlay.appendChild(
        overlayVideo
    );

    document.body.appendChild(
        videoOverlay
    );

    overlayVideo
        .play()
        .then(() => {

            console.log(
                "Vídeo começou!"
            );

        })
        .catch((error) => {

            console.error(
                "Erro ao tocar vídeo:",
                error
            );

        });
}

async function atualizarTransicao(
    data:
        | {
            ativa: boolean;
            tipo?: string;
            video?: string;
        }
        | undefined
) {

    /*
     * Desligar tudo
     */

    if (!data?.ativa) {

        await removerTelaPreta();

        removerVideo();

        return;
    }

    /*
     * Tela preta
     */

    if (
        data.tipo ===
        "black"
    ) {

        removerVideo();

        await criarTelaPreta();

        return;
    }

    /*
     * Vídeo
     */

    if (
        data.tipo ===
        "video" &&
        data.video
    ) {

        await removerTelaPreta();

        if (
            overlayVideo?.src !==
            data.video
        ) {

            criarVideo(
                data.video
            );
        }

        return;
    }

}

OBR.onReady(async () => {

    console.log(
        "Transition pronto!"
    );

    const role =
        await OBR.player.getRole();

    console.log(
        "Cargo:",
        role
    );

    /*
     * O GM não recebe transições.
     */

    if (role === "GM") {

        console.log(
            "GM detectado."
        );

        return;
    }

    /*
     * Mudanças futuras
     */

    OBR.room.onMetadataChange(
        async (metadata) => {

            const data =
                metadata[
                    TRANSITION_KEY
                ] as
                    | {
                        ativa: boolean;
                        tipo?: string;
                        video?: string;
                    }
                    | undefined;

            console.log(
                "Metadata completa:",
                metadata
            );

            console.log(
                "Data recebida:",
                data
            );

            console.log(
                "Ativa:",
                data?.ativa
            );

            console.log(
                "Tipo:",
                data?.tipo
            );

            console.log(
                "Vídeo:",
                data?.video
            );

            await atualizarTransicao(
                data
            );

        }
    );

    /*
     * Estado atual para jogadores
     * que acabaram de entrar.
     */

    const metadataAtual =
        await OBR.room.getMetadata();

    const dadosAtuais =
        metadataAtual[
            TRANSITION_KEY
        ] as
            | {
                ativa: boolean;
                tipo?: string;
                video?: string;
            }
            | undefined;

    console.log(
        "Estado inicial:",
        dadosAtuais
    );

    await atualizarTransicao(
        dadosAtuais
    );

});