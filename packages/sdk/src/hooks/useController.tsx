import React, { useState } from 'react';
import Modal from 'react-modal';
import { useAnimatedQRCodePlayer } from './useAnimatedQRCodePlayer';
import { useAnimatedQRCodeReader } from './useAnimatedQRCodeReader';
import { Play, Read } from '../types';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        borderRadius: '10px',
        width: '37rem',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        postion: 'relative'
    },
};

export const useController = (): [
    JSX.Element,
    {
        play: Play;
        read: Read;
        cameraReady: boolean;
    },
] => {
    const [visible, setVisible] = useState(false);
    const [mode, setMode] = useState<'read' | 'play'>('play');
    const [AnimatedQRCodePlayer, { play }] = useAnimatedQRCodePlayer();
    const [AnimatedQRCodeReader, { read, cameraReady }] = useAnimatedQRCodeReader();
    const reset = () => {
        setVisible(false);
        setMode('play');
    };
    const element = (
        <Modal isOpen={visible} style={customStyles}>
            <div onClick={() => setVisible(false)}>
                <img style={{ position: "absolute", top: '1rem', right: '1rem' }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAADKADAAQAAAABAAAADAAAAAATDPpdAAAAmklEQVQoFZWRwQ3DIAwAa4brJPBP80hnaD/lD5N0iYxEfRVBxBGRwsvgO2PZklJaReTrvX/eTk7O+VVKuTtgDRYVPyOeHAysAFV40jCGEB69aHN/YSRZGK4JVuKu5/DrToDoqnI9tOh4vXJ2Qlc96kSY2lTfWs0m9DCT0r3MSkUrXR9r3eBCNbuDrY/td23z7Vg3wQhGIgcD+wPGY2fPvHuWagAAAABJRU5ErkJggg=="/>
            </div>
            <div
                style={{
                    width: '35rem',
                    boxSizing: 'border-box',
                    padding: 18,
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {mode === 'read' ? AnimatedQRCodeReader : AnimatedQRCodePlayer}
            </div>
        </Modal>
    );
    return [
        element,
        {
            play: async (data, options) => {
                setVisible(true);
                setMode('play');
                await play(data, options);
                reset();
                return;
            },
            read: async (expect, options) => {
                setVisible(true);
                setMode('read');
                const result = await read(expect, options);
                reset();
                return result;
            },
            cameraReady,
        },
    ];
};