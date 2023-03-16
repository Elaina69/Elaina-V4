import data from '../configs/ElainaV2_config.json'
let default_settings = data

function Audio() {
    const audio = document.createElement("audio");
    audio.autoplay = true;
    audio.loop = true;
    audio.src = default_settings["audio_src"];
    audio.id = 'bg-audio';
    audio.load()
    audio.addEventListener("load", function() { audio.play() }, true);

    document.querySelector("body").prepend(audio)
}

let AudioExport = {
    Audio: Audio
}

export default AudioExport