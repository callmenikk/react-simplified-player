import { useEffect, useRef, useState, FC } from "react";
import { loopSong } from "./utils/loopSong";
import { loadSongAndPlay } from "./utils/loadSongAndPlay";
import { QueueType } from "./typings/playerTypes";
import { PlayerProps } from "./typings/playerTypes";
import { token } from "./utils/token";
import { initialConfig, ConfigsTypes, LoopType } from "./typings/initialStates";
import ConfigPanel from "./Components/Desktop/ConfigPanel";
import SongContent from "./Components/Desktop/SongContent";
import Player from "./Components/Desktop/Player";
import MobilePlayer from "./Components/Mobile/MobilePlayer";
import Queue from "./Components/Desktop/Queue";
import "./style/style.css";
import "./style/loader.css";
import "./style/mobile-style.css";


const ReactSimplifiedPlayer: FC<PlayerProps> = (props) => {
  const [control, setControl] = useState<ConfigsTypes>(initialConfig);
  const [loop, setLoop] = useState<number>(0);
  const playerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mobileViewRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [isOpenQueue, setIsOpenQueue] = useState(false);
  const [volume, setVolume] = useState<number>(
    props.defaultVolume === undefined ? 0.5 : props.defaultVolume
  );
  const [windowWidth, setWindowWith] = useState(window.innerWidth);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [popUp, setPopUp] = useState(false);
  const [songData, setSongData] = useState<QueueType[]>([
    {
      song_cover:
        "https://i.scdn.co/image/ab67616d0000b273861f0d79ff28c0206bb34474",
      song_title: "Die Young ",
      id: "213123",
      song_artist: "Ke$ha",
      url: "https://cdns-preview-f.dzcdn.net/stream/c-ff22ec58ad90bb8192c694acd3bd9c6f-4.mp3",
    },
    {
      song_cover:
        "https://upload.wikimedia.org/wikipedia/en/f/f8/Kesha_-_Rainbow_%28Official_Album_Cover%29.png",
      id: "213132423",
      song_title: "Praying",
      song_artist: "Kesha",
      url: "https://cdns-preview-4.dzcdn.net/stream/c-43f197ffaae18e3b1d91f067fbd30bf7-6.mp3",
    },
    {
      song_cover: "",
      song_title: "Random Song",
      id: "213sfd123",
      song_artist: "",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      url: "https://cdns-preview-5.dzcdn.net/stream/c-574bda6938dee538a9b88fa576f6bc5b-5.mp3",
      song_title: "We R who we R ",
      id: "2130sdlf0=123",
      song_artist: "Ke$ha",
      song_cover:
        "https://upload.wikimedia.org/wikipedia/en/8/85/Cannibal_cover.jpg",
    },
    {
      song_cover:
        "https://e-cdns-images.dzcdn.net/images/cover/92db233804151e1bef19e26a3d5e78f0/250x250-000000-80-0-0.jpg",
      song_title: "Learn to Let Go",
      id: "2138jad0saj123",
      song_artist: "Kesha",
      url: "https://cdns-preview-7.dzcdn.net/stream/c-705c80d5ea1588ea474f0117b39630d1-6.mp3",
    },
    {
      song_cover:
        "https://e-cdns-images.dzcdn.net/images/cover/fad7de079aa103d60ec1e2d1582c2281/250x250-000000-80-0-0.jpg",
      song_title: "Bad Romance",
      id: "21312a8dsj3",
      song_artist: "Lady Gaga",
      url: "https://cdns-preview-a.dzcdn.net/stream/c-a0f6f354043545619b46daae9cd9aa40-17.mp3",
    },
  ]);
  const [currentRef, setCurrentRef] = useState(audioRef);
  const repeatInitial: LoopType[] = ["none", "repeat", "repeat-song"];

  // useEffect(() => {
  //   const lastIndex: number = songData.length - 1;

  //   if(!props.song!.url.trim()) return

  //   if (
  //     songData[0]?.song_title?.trim() === songData[1]?.song_title?.trim() &&
  //     songData[0]?.song_artist?.trim() === songData[1]?.song_artist?.trim()
  //   )
  //     setSongData((prev) => {
  //       return prev.slice(1, 0);
  //     });

  //   if (
  //     props.song!.song_title?.trim() ===
  //       songData[lastIndex]?.song_title?.trim() &&
  //     props.song!.song_artist?.trim() ===
  //       songData[lastIndex]?.song_artist?.trim()
  //   )
  //     return;

  //   setSongData((prev) => {
  //     return [
  //       ...prev,
  //       {
  //         ...props.song,
  //         id: token().toString(),
  //       },
  //     ];
  //   });
  // }, [props.song]);

  const [timeLapse, setTimeLapse] = useState({
    current: 0,
    full_length: 0,
  });

  useEffect(() => {
    if (windowWidth <= 768) return setCurrentRef(mobileViewRef);

    setCurrentRef(audioRef);
  }, [windowWidth]);

  const onEndedAudio = () => {
    if (repeatInitial[loop] === "none") return;

    if (repeatInitial[loop] === "repeat") {
      if (control.shuffle) {
        const randomNumber = Math.floor(Math.random() * songData.length);
        setCurrentIndex(randomNumber);
        loadSongAndPlay(currentRef);
        return setControl((prev) => {
          return { ...prev, playing: true };
        });
      }
      setCurrentIndex((prev) => loopSong(prev, songData));
      loadSongAndPlay(currentRef);
      return setControl((prev) => {
        return { ...prev, playing: true };
      });
    }

    if (repeatInitial[loop] === "repeat-song") {
      currentRef.current!.currentTime = 0;
      setControl((prev) => {
        return {
          ...prev,
          playing: true,
        };
      });
    }
  };

  const onTimeUpdate = () => {
    const current = currentRef.current?.currentTime as number;
    const duration = currentRef.current?.duration as number;

    const percentage = ((current / duration) * 100).toFixed(1);
    setCurrentDuration(Number(percentage));

    setTimeLapse((prev) => {
      return {
        ...prev,
        current: currentRef.current?.currentTime as number,
      };
    });
  };

  const onTimeEnd = () => {
    setControl((prev) => {
      return {
        ...prev,
        playing: false,
      };
    });
    if(props.onAudioEnded !== undefined) props.onAudioEnded(songData[currentIndex])
  };

  const onLoadAudio = () => {
    setIsLoading(true);
    setTimeLapse((prev) => {
      return {
        ...prev,
        full_length: currentRef.current?.duration as number,
      };
    });
    setIsLoading(false);
  };

  const onWindowResize = () => {
    setWindowWith(window.innerWidth);
  };

  useEffect(() => {
    currentRef.current?.addEventListener("timeupdate", onTimeUpdate);
    currentRef.current?.addEventListener("ended", onTimeEnd);
    currentRef.current?.addEventListener("canplaythrough", onLoadAudio);
    currentRef.current?.addEventListener("ended", onEndedAudio, false);
    window.addEventListener("resize", onWindowResize);
    return () => {
      currentRef.current?.removeEventListener("timeupdate", onTimeUpdate);
      currentRef.current?.removeEventListener("ended", onTimeEnd);
      currentRef.current?.removeEventListener("canplaythrough", onLoadAudio);
      currentRef.current?.removeEventListener("ended", onEndedAudio, false);
      window.removeEventListener("resize", onWindowResize);
    };
  });

  useEffect(() => {
    if (songData.length === 0) return;

    const audio = new Audio(songData[currentIndex].url);
    const duration = audio.duration;

    setTimeLapse((prev) => {
      return {
        ...prev,
        full_length: duration,
      };
    });

    audio.volume = volume;
    currentRef.current!.load();
    setControl((prev) => {
      return {
        ...prev,
        playing: false,
      };
    });
  }, []);

  useEffect(() => {
    if (control.playing) {
      currentRef.current?.play();
      if(props.onAudioPlay !== undefined) props.onAudioPlay!(songData[currentIndex]);
    }
    if (!control.playing) {
      currentRef.current?.pause();
      if(props.onAudioPause !== undefined) props.onAudioPause!(songData[currentIndex])
    }
  }, [control]);

  useEffect(() => {
    currentRef.current!.volume = volume;
  }, [volume]);

  const onChangeLoop = () => {
    const maxNum: number = repeatInitial.length - 1;
    const setNextNumber: number = loop === maxNum ? 0 : loop + 1;

    setLoop(setNextNumber);
  };

  const backToSong = () => {
    setCurrentIndex((prev) => {
      const lastSongIndex: number = songData.length - 1;

      if (prev - 1 <= -1) return lastSongIndex;
      return prev - 1;
    });

    if(props.onBack !== undefined) props.onBack!(songData[currentIndex])

    setControl((prev) => {
      return {
        ...prev,
        playing: true,
      };
    });
  };

  const forwardSong = () => {
    setCurrentIndex((prev) => {
      if (prev + 1 === songData.length) return 0;
      return prev + 1;
    });

    if(props.onForward !== undefined) props.onForward(songData[currentIndex])

    setControl((prev) => {
      return {
        ...prev,
        playing: true,
      };
    });
    currentRef.current?.play()
  };

  const setDuration = (time: number) => {
    setCurrentDuration(time);
    setControl((prev) => {
      return {
        ...prev,
        playing: true,
      };
    });
  };

  const removeSong = (index: number) => {
    if (currentIndex === index && control.playing) {
      setControl((prev) => {
        return {
          ...prev,
          playing: false,
        };
      });
      loadSongAndPlay(currentRef);
      setControl((prev) => {
        return {
          ...prev,
          playing: true,
        };
      });
    }

    if (index < currentIndex) {
      setCurrentIndex((prev) => prev - 1);
    }

    setSongData((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    if (songData.length <= 0) {
      setControl((prev) => {
        return {
          ...prev,
          playing: false,
        };
      });
      setTimeLapse({
        current: 0,
        full_length: 0,
      });
      setCurrentDuration(0);
    }
  }, [songData]);

  const onControlChange = (key: keyof ConfigsTypes) => {
    const opositeValue: boolean = !control[key];

    setControl((prev) => {
      return {
        ...prev,
        [key]: opositeValue,
      };
    });
  };

  const onContextMenu = (e: MouseEvent) => {
    // e.preventDefault()
  };

  useEffect(() => {
    playerRef.current?.addEventListener("contextmenu", onContextMenu);
    return () => {
      playerRef.current?.removeEventListener("contextmenu", onContextMenu);
    };
  });

  return (
    <>
      <div className="container" ref={playerRef}>
        <SongContent
          openPlayer={() => setPopUp(true)}
          windowWidth={windowWidth}
          song_cover={
            songData[currentIndex]?.song_cover == null
              ? ""
              : songData[currentIndex].song_cover
          }
          song_name={
            songData[currentIndex]?.song_title == null
              ? ""
              : songData[currentIndex].song_title?.trim()
          }
          artist={
            songData[currentIndex]?.song_artist?.trim() == null
              ? ""
              : songData[currentIndex].song_artist?.trim()
          }
          isLoading={isLoading}
        />
        <Player
          {...control}
          color={props.mainColor}
          isSongLoaded={songData.length !== 0 ?? false}
          backSong={backToSong}
          forwardSong={forwardSong}
          ref={currentRef}
          song_uri={songData[currentIndex]?.url}
          setDuration={(time) => setDuration(time)}
          toggleButton={(key) => onControlChange(key)}
          repeat={onChangeLoop}
          skipToTime={(to) => {
            currentRef.current!.currentTime = to;
            setCurrentDuration(to);
          }}
          loop={loop}
          currentDutaion={currentDuration}
          total_length={timeLapse.full_length}
          current={timeLapse.current}
        />
        <ConfigPanel
          color={props.mainColor}
          openQueue={() => setIsOpenQueue(true)}
          volume={volume}
          showQueue={props.showQueue!}
          setVolume={(volumee) =>
            setVolume(() => {
              if (volumee * 0.01 <= 0) return 0;
              if (volumee * 0.01 >= 1) return 1;

              if(props.onVolumeChange !== undefined) props.onVolumeChange!(volumee * 0.01);
              return volumee * 0.01;
            })
          }
        />
        <div className="small-time-lapse">
          <div
            className="small-current-time"
            style={{
              width: `${currentDuration}%`,
            }}
          />
        </div>
      </div>
      {windowWidth <= 768 && (
        <MobilePlayer
          {...control}
          showQueue={props.showQueue!}
          color={props.mainColor}
          currentIndex={currentIndex}
          onQueueOpen={(bool) => setIsOpenQueue(bool)}
          songs={songData}
          removeSong={removeSong}
          playSong={(index) => {
            setControl((prev) => {
              return {
                ...prev,
                playing: false,
              };
            });
            setCurrentIndex(index);
            setControl((prev) => {
              return {
                ...prev,
                playing: true,
              };
            });
          }}
          queuePopUp={isOpenQueue}
          openQueue={() => setIsOpenQueue(true)}
          onPopUp={() => setPopUp(false)}
          isSongLoaded={songData.length !== 0 ?? false}
          backSong={backToSong}
          forwardSong={forwardSong}
          popUp={popUp}
          ref={mobileViewRef}
          song_uri={songData[currentIndex]?.url}
          setDuration={(time) => setDuration(time)}
          toggleButton={(key) => onControlChange(key)}
          repeat={onChangeLoop}
          skipToTime={(to) => {
            currentRef.current!.currentTime = to;
            setCurrentDuration(to);
          }}
          loop={loop}
          currentDutaion={currentDuration}
          total_length={timeLapse.full_length}
          current={timeLapse.current}
          src={
            songData[currentIndex]?.song_cover === undefined
              ? ""
              : (songData[currentIndex]?.song_cover as string)
          }
          song_name={
            songData[currentIndex]?.song_title === undefined
              ? ""
              : songData[currentIndex].song_title?.trim()
          }
          song_artist={
            songData[currentIndex]?.song_artist?.trim() === undefined
              ? ""
              : songData[currentIndex].song_artist?.trim()
          }
        />
      )}
      {windowWidth > 768 && props.showQueue && (
        <Queue
          currentIndex={currentIndex}
          onQueueOpen={(bool) => setIsOpenQueue(bool)}
          songs={songData}
          removeSong={removeSong}
          playSong={(index) => {
            setControl((prev) => {
              return {
                ...prev,
                playing: false,
              };
            });
            setCurrentIndex(index);
            setControl((prev) => {
              return {
                ...prev,
                playing: true,
              };
            });
          }}
          queuePopUp={isOpenQueue}
        />
      )}
    </>
  );
};

export default ReactSimplifiedPlayer;
