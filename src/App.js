// import axios from 'axios';
import { useEffect, useRef } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('localhost:3030');

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    socket.on('helloReturn', function (arrayBuffer) {
      var blob = new Blob([arrayBuffer], { 'type': 'audio/ogg; codecs=opus' });
      audioRef.current.src = window.URL.createObjectURL(blob);
      audioRef.current.play();
    });
  }, [])

  useEffect(() => {
    const constraints = { audio: true };
    setInterval(() => {
      navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
        let mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.onstart = function (e) {
          this.chunks = [];
        };
        mediaRecorder.ondataavailable = function (e) {
          this.chunks.push(e.data);
        };
        mediaRecorder.onstop = function (e) {
          var blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
          socket.emit('hello', blob);
        };

        // Start recording
        mediaRecorder.start();

        // Stop recording after 5 seconds and broadcast it to server
        setTimeout(function () {
          mediaRecorder.stop()
        }, 500);
      });
    }, 500);
  })


  return (
    <div className="App">
      <audio src='' ref={audioRef} />
    </div>
  );
}

export default App;
