import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';
import chroma from 'chroma-js';

function randomColor() {
    const c = Math.random() * 0.4 + 0.1;
    const h = Math.round(360 * Math.random());
    return chroma.oklch(0.7, c, h);
}

function rotateHue(color, minDeg = 120, maxDeg = 240) {
    const [l, c, h] = color.oklch();
    const newHue = (h + (Math.random() * (maxDeg - minDeg) + minDeg)) % 360;
    return chroma.oklch(l, c, newHue);
}

const intermediate = 1024

const ColorInterpolation = () => {
    const [color1, setColor1] = useState("#9013FE");
    const [color2, setColor2] = useState("#50E3C2");

    const [showPicker1, setShowPicker1] = useState(false);
    const [showPicker2, setShowPicker2] = useState(false);

    const pickerRef1 = useRef(null);
    const pickerRef2 = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef1.current && !pickerRef1.current.contains(e.target)) {
                setShowPicker1(false);
            }
            if (pickerRef2.current && !pickerRef2.current.contains(e.target)) {
                setShowPicker2(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const generateRGBInterpolation = () => {
        const scale = chroma.scale([color1, color2]).mode('rgb').colors(intermediate);
        return scale.map((color) => chroma(color).rgb());
    };

    const generateOKLCHInterpolation = () => {
        const scale = chroma.scale([color1, color2]).mode('oklch').colors(intermediate);
        return scale.map((color) => chroma(color).oklch());
    };

    const generateOKLABInterpolation = () => {
        const scale = chroma.scale([color1, color2]).mode('oklab').colors(intermediate);
        return scale.map((color) => chroma(color).oklab());
    };

    const rgbInterpolation = generateRGBInterpolation();
    const oklchInterpolation = generateOKLCHInterpolation();
    const oklabInterpolation = generateOKLABInterpolation();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'first baseline', position: 'relative'}}>
                    <h3 style={{ marginRight: '10px', marginBottom: 0 }}>开始颜色</h3>
                    <div
                        onClick={() => setShowPicker1(!showPicker1)}
                        style={{ width: 16, height: 16, backgroundColor: color1, cursor: 'pointer', border: '1px solid #ccc' }}
                    />
                    {showPicker1 && (
                        <div style={{ position: 'absolute', zIndex: 2, top: '50px' }} ref={pickerRef1}>
                            <SketchPicker color={color1} onChange={(color) => setColor1(color.hex)} />
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'first baseline', position: 'relative' }}>
                    <h3 style={{ marginRight: '10px', marginBottom: 0 }}>结束颜色</h3>
                    <div
                        onClick={() => setShowPicker2(!showPicker2)}
                        style={{ width: 16, height: 16, backgroundColor: color2, cursor: 'pointer', border: '1px solid #ccc' }}
                    />
                    {showPicker2 && (
                        <div style={{ position: 'absolute', zIndex: 2, top: '50px' }} ref={pickerRef2}>
                            <SketchPicker color={color2} onChange={(color) => setColor2(color.hex)} />
                        </div>
                    )}
                </div>
            </div>

            <div style={{ width: '100%', marginBottom: '20px' }}>
                <h4>RGB 插值过渡</h4>
                <div style={{
                    width: '100%',
                    height: '50px',
                    background: `linear-gradient(to right, ${rgbInterpolation.map(color => `rgb(${color.join(',')})`).join(', ')})`
                }} />
            </div>

            <div style={{ width: '100%', marginBottom: '20px' }}>
                <h4>OKLAB 插值过渡</h4>
                <div style={{
                    width: '100%',
                    height: '50px',
                    background: `linear-gradient(to right, ${oklabInterpolation.map(color => `rgb(${chroma.oklab(color[0], color[1], color[2]).rgb().join(',')})`).join(', ')})`
                }} />
            </div>

            <div style={{ width: '100%', marginBottom: '20px' }}>
                <h4>OKLCH 插值过渡</h4>
                <div style={{
                    width: '100%',
                    height: '50px',
                    background: `linear-gradient(to right, ${oklchInterpolation.map(color => `rgb(${chroma.oklch(color[0], color[1], color[2]).rgb().join(',')})`).join(', ')})`
                }} />
            </div>
        </div>
    );
};

export default ColorInterpolation;
