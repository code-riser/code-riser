"use strict";

const GITHUB_USERNAME = "code-riser";
const ASCII_WIDTH = 86;
const ASCII_CHARS = "@%#*+=-:. ";

const asciiElement = document.querySelector("svg .ascii");

if (asciiElement) {
    loadGithubAvatar();
}

async function loadGithubAvatar() {
    try {
        const avatarURL =
            `https://github.com/${GITHUB_USERNAME}.png?size=512`;

        const image = await loadImage(avatarURL);

        const ascii = convertToASCII(image);

        renderASCII(ascii);

    } catch (error) {
        console.error("GitHub ASCII Avatar Error:", error);
    }
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.crossOrigin = "anonymous";

        image.onload = () => resolve(image);

        image.onerror = () =>
            reject(new Error("Unable to load GitHub avatar."));

        image.src = url;
    });
}

function convertToASCII(image) {
    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d", {
        willReadFrequently: true
    });

    const width = ASCII_WIDTH;

    const height = Math.max(
        1,
        Math.floor(
            width *
            (image.height / image.width) *
            0.48
        )
    );

    canvas.width = width;
    canvas.height = height;

    context.drawImage(
        image,
        0,
        0,
        width,
        height
    );

    const imageData = context.getImageData(
        0,
        0,
        width,
        height
    );

    const pixels = imageData.data;

    const lines = [];

    for (let y = 0; y < height; y++) {
        let line = "";

        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;

            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            const a = pixels[index + 3];

            if (a < 30) {
                line += " ";
                continue;
            }

            const brightness =
                r * 0.299 +
                g * 0.587 +
                b * 0.114;

            const darkness = 255 - brightness;

            let charIndex = Math.floor(
                (darkness / 255) *
                (ASCII_CHARS.length - 1)
            );

            charIndex = Math.max(
                0,
                Math.min(
                    ASCII_CHARS.length - 1,
                    charIndex
                )
            );

            line += ASCII_CHARS[charIndex];
        }

        lines.push(line);
    }

    return lines;
}

function renderASCII(lines) {
    while (asciiElement.firstChild) {
        asciiElement.removeChild(
            asciiElement.firstChild
        );
    }

    const startX = 30;
    const startY = 80;
    const lineHeight = 7.55;

    lines.forEach((line, index) => {
        const tspan = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "tspan"
        );

        tspan.setAttribute(
            "x",
            String(startX)
        );

        tspan.setAttribute(
            "y",
            String(
                startY +
                index * lineHeight
            )
        );

        tspan.setAttribute(
            "xml:space",
            "preserve"
        );

        tspan.textContent = line;

        asciiElement.appendChild(tspan);
    });
}