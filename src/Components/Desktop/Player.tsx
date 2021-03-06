import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faForwardStep,
  faBackwardStep,
  faShuffle,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import { ConfigsTypes } from "../../typings/initialStates";
import PlayerDragger from "./PlayerDragger";
import { forwardRef } from "react";
import { formatSeconds } from "../../utils/formatSeconds";

export interface PlayerProps {
  toggleButton: (key: keyof ConfigsTypes) => void;
  repeat: () => void;
  setDuration: (time: number) => void;
  skipToTime: (to: number) => void;
  backSong: () => void;
  forwardSong: () => void;
  playing: boolean;
  shuffle: boolean;
  loop: number;
  currentDutaion: number;
  current: number;
  total_length: number;
  song_uri: string;
  isSongLoaded: boolean;
  color: string
}

const Player = forwardRef<HTMLAudioElement, PlayerProps>((props, ref) => {
  return (
    <div className="player">
      <audio
        src={props.song_uri}
        ref={ref}
        style={{
          visibility: "hidden",
        }}
      />
      <div className="buttons-wrapper">
        <div
          className="secondary-btn"
          onClick={() => props.toggleButton("shuffle")}
        >
          {props.shuffle && <FontAwesomeIcon icon={faShuffle} color={"#FFF"} />}
          {!props.shuffle && (
            <FontAwesomeIcon icon={faShuffle} color={"#545454"} />
          )}
        </div>
        <div
          className={
            props.isSongLoaded ? "secondary-btn" : "secondary-btn forbidden"
          }
          onClick={() => {
            if (!props.isSongLoaded) return;
            props.backSong();
          }}
        >
          <FontAwesomeIcon icon={faBackwardStep} color={"#FFF"} />
        </div>
        <div
          className={
            props.isSongLoaded ? "control-btn" : "control-btn forbidden"
          }
          onClick={() => {
            if (!props.isSongLoaded) return;
            props.toggleButton("playing");
          }}
        >
          {!props.playing ? (
            <FontAwesomeIcon
              icon={faPlay}
              style={{
                transform: "translateX(1.5px)",
              }}
            />
          ) : (
            <FontAwesomeIcon icon={faPause} />
          )}
        </div>
        <div
          className={
            props.isSongLoaded ? "secondary-btn" : "secondary-btn forbidden"
          }
          onClick={() => {
            if (!props.isSongLoaded) return;
            props.forwardSong();
          }}
        >
          <FontAwesomeIcon icon={faForwardStep} color={"#FFF"} />
        </div>
        <div className="secondary-btn" onClick={props.repeat}>
          {props.loop === 2 && <p className="small-one">1</p>}
          {props.loop === 0 && (
            <FontAwesomeIcon icon={faRepeat} color={"#545454"} />
          )}
          {props.loop === 1 && (
            <FontAwesomeIcon icon={faRepeat} color={"#FFF"} />
          )}
          {props.loop === 2 && (
            <FontAwesomeIcon icon={faRepeat} color={"#FFF"} />
          )}
        </div>
      </div>
      <div className="mobile-view-timelapse">
        <p
          style={{
            fontSize: "0.8em",
          }}
        >
          {formatSeconds(props.current)}
        </p>
        <p
          style={{
            fontSize: "0.8em",
          }}
        >
          {formatSeconds(props.total_length)}
        </p>
      </div>
      <PlayerDragger
        color={props.color}
        isSongLoaded={props.isSongLoaded}
        currentDuration={props.currentDutaion}
        setDuration={(time) => props.setDuration(time)}
        current={props.current}
        total_length={props.total_length}
        skipToTime={props.skipToTime}
      />
    </div>
  );
});

export default Player;
