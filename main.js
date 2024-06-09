let audio = document.querySelector(".quranPlayer"),
    surahsContainer = document.querySelector(".surahs"),
    ayah = document.querySelector(".ayah"),
    next = document.querySelector(".next"),
    prev = document.querySelector(".prev"),
    play = document.querySelector(".play");

getSurahs();

function getSurahs() {
    fetch("https://api.alquran.cloud/v1/surah")
        .then((response) => response.json())
        .then((data) => {
            data.data.forEach(surah => {
                surahsContainer.innerHTML += `
                    <div>
                        <p>${surah.englishName}</p>
                        <p>${surah.name}</p>
                    </div>
                `;
            });

            let allSurahs = document.querySelectorAll(".surahs div"),
                AyahsAudios = [],
                AyahsText = [];

            allSurahs.forEach((surah, index) => {
                surah.addEventListener("click", () => {
                    fetch(`https://api.alquran.cloud/v1/surah/${index + 1}/ar.alafasy`)
                        .then((response) => response.json())
                        .then((data) => {
                            let verses = data.data.ayahs;
                            AyahsAudios = [];
                            AyahsText = [];
                            verses.forEach((verse) => {
                                AyahsAudios.push(verse.audio);
                                AyahsText.push(verse.text);
                            });

                            let AyahIndex = 0;
                            changeAyah(AyahIndex);

                            audio.removeEventListener("ended", handleAudioEnded);
                            audio.addEventListener("ended", handleAudioEnded);

                            next.removeEventListener("click", handleNext);
                            next.addEventListener("click", handleNext);

                            prev.removeEventListener("click", handlePrev);
                            prev.addEventListener("click", handlePrev);

                            play.removeEventListener("click", togglePlay);
                            play.addEventListener("click", togglePlay);

                            let isPlaying = false;

                            function togglePlay() {
                                if (isPlaying) {
                                    audio.pause();
                                    play.innerHTML = `<i class="fas fa-play"></i>`;
                                } else {
                                    audio.play();
                                    play.innerHTML = `<i class="fas fa-pause"></i>`;
                                }
                                isPlaying = !isPlaying;
                            }

                            function handleNext() {
                                AyahIndex = (AyahIndex < AyahsAudios.length - 1) ? AyahIndex + 1 : 0;
                                changeAyah(AyahIndex);
                            }

                            function handlePrev() {
                                AyahIndex = (AyahIndex === 0) ? AyahsAudios.length - 1 : AyahIndex - 1;
                                changeAyah(AyahIndex);
                            }

                            function handleAudioEnded() {
                                AyahIndex++;
                                if (AyahIndex < AyahsAudios.length) {
                                    changeAyah(AyahIndex);
                                } else {
                                    AyahIndex = 0;
                                    changeAyah(AyahIndex);
                                    audio.pause();
                                    Swal.fire({
                                        position: "center",
                                        icon: "success",
                                        title: "تم انتهاء السورة",
                                        showConfirmButton: false,
                                        timer: 1500,
                                    });
                                    isPlaying = true;
                                    togglePlay();
                                }
                            }

                            function changeAyah(index) {
                                audio.src = AyahsAudios[index];
                                ayah.innerHTML = AyahsText[index];
                            }
                        });
                });
            });
        });
}
