document.addEventListener('DOMContentLoaded', function () {
    // --- LÓGICA DEL CÍRCULO CROMÁTICO ---
    const colorWheel = document.querySelector('.color-wheel');
    const tooltip = document.getElementById('tooltip');
    const colors = [
        { name: 'Amarillo', type: 'Primario', hex: '#FFFF00' },
        { name: 'Lima', type: 'Terciario', hex: '#80FF00' },
        { name: 'Verde', type: 'Secundario', hex: '#00FF00' },
        { name: 'Verde Cian', type: 'Terciario', hex: '#00FF80' },
        { name: 'Cian', type: 'Primario', hex: '#00FFFF' },
        { name: 'Azul Cerúleo', type: 'Terciario', hex: '#0080FF' },
        { name: 'Azul', type: 'Secundario', hex: '#0000FF' },
        { name: 'Violeta', type: 'Terciario', hex: '#8000FF' },
        { name: 'Magenta', type: 'Primario', hex: '#FF00FF' },
        { name: 'Rosa', type: 'Terciario', hex: '#FF0080' },
        { name: 'Rojo', type: 'Secundario', hex: '#FF0000' },
        { name: 'Naranja', type: 'Terciario', hex: '#FF8000' },
    ];

    colors.forEach((color, i) => {
        const slice = document.createElement('div');
        slice.className = 'color-slice';
        const rotation = i * 30; // 360 / 12 = 30
        slice.style.setProperty('--rotation', `${rotation}deg`);
        slice.style.background = `linear-gradient(90deg, ${color.hex}, ${colors[(i + 1) % 12].hex})`;
        slice.style.transform = `rotate(${rotation}deg)`;
        
        slice.addEventListener('mouseover', () => {
            tooltip.textContent = `${color.name} (${color.type})`;
            tooltip.classList.add('visible');
        });
        
        slice.addEventListener('mouseout', () => {
            tooltip.classList.remove('visible');
        });

        colorWheel.appendChild(slice);
    });

    // --- LÓGICA DE PROPIEDADES DEL COLOR (HSB/HSV) ---
    const hueSlider = document.getElementById('hue-slider');
    const saturationSlider = document.getElementById('saturation-slider');
    const valueSlider = document.getElementById('value-slider');
    const colorPreview = document.getElementById('color-preview');
    const colorValues = document.getElementById('color-values');

    function updateColorPreview() {
        const h = hueSlider.value;
        const s = saturationSlider.value;
        const v = valueSlider.value;
        
        const backgroundColor = `hsl(${h}, ${s}%, ${v * 0.5 + 50 * (1 - s/100)}%)`; // Aproximación HSL para visualización
        const hsvColor = `hsv(${h}, ${s}%, ${v}%)`;
        colorPreview.style.backgroundColor = hsvColor; // Usamos un truco con HSL para CSS
        
        // Conversión HSV a RGB para mostrar valores
        let s_norm = s / 100;
        let v_norm = v / 100;
        let c = v_norm * s_norm;
        let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        let m = v_norm - c;
        let r_prime, g_prime, b_prime;

        if (h >= 0 && h < 60) { [r_prime, g_prime, b_prime] = [c, x, 0]; }
        else if (h >= 60 && h < 120) { [r_prime, g_prime, b_prime] = [x, c, 0]; }
        else if (h >= 120 && h < 180) { [r_prime, g_prime, b_prime] = [0, c, x]; }
        else if (h >= 180 && h < 240) { [r_prime, g_prime, b_prime] = [0, x, c]; }
        else if (h >= 240 && h < 300) { [r_prime, g_prime, b_prime] = [x, 0, c]; }
        else { [r_prime, g_prime, b_prime] = [c, 0, x]; }

        const [r, g_val, b] = [(r_prime + m) * 255, (g_prime + m) * 255, (b_prime + m) * 255];

        colorPreview.style.backgroundColor = `rgb(${r}, ${g_val}, ${b})`;
        colorValues.innerHTML = `
            <strong>HSV:</strong> ${h}, ${s}%, ${v}%<br>
            <strong>RGB:</strong> ${Math.round(r)}, ${Math.round(g_val)}, ${Math.round(b)}
        `;
    }

    [hueSlider, saturationSlider, valueSlider].forEach(slider => {
        slider.addEventListener('input', updateColorPreview);
    });
    updateColorPreview(); // Llamada inicial

    // --- LÓGICA DE ARMONÍAS DE COLOR ---
    const colorPicker = document.getElementById('harmony-color-picker');
    const palettesContainer = document.getElementById('harmony-palettes');

    function hexToHsv(hex) {
        let r = 0, g = 0, b = 0;
        r = parseInt(hex.substring(1, 3), 16) / 255;
        g = parseInt(hex.substring(3, 5), 16) / 255;
        b = parseInt(hex.substring(5, 7), 16) / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;
        let d = max - min;
        s = max == 0 ? 0 : d / max;
        if (max == min) { h = 0; } 
        else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s * 100, v: v * 100 };
    }

    function hsvToHex(h, s, v) {
        s /= 100; v /= 100;
        let c = v * s;
        let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        let m = v - c;
        let r_prime, g_prime, b_prime;
        if (h >= 0 && h < 60) { [r_prime, g_prime, b_prime] = [c, x, 0]; }
        else if (h >= 60 && h < 120) { [r_prime, g_prime, b_prime] = [x, c, 0]; }
        else if (h >= 120 && h < 180) { [r_prime, g_prime, b_prime] = [0, c, x]; }
        else if (h >= 180 && h < 240) { [r_prime, g_prime, b_prime] = [0, x, c]; }
        else if (h >= 240 && h < 300) { [r_prime, g_prime, b_prime] = [x, 0, c]; }
        else { [r_prime, g_prime, b_prime] = [c, 0, x]; }
        let toHex = (val) => Math.round(val * 255).toString(16).padStart(2, '0');
        return `#${toHex(r_prime + m)}${toHex(g_prime + m)}${toHex(b_prime + m)}`;
    }

    function generateHarmonies() {
        const baseColorHex = colorPicker.value;
        const baseColorHsv = hexToHsv(baseColorHex);
        const { h, s, v } = baseColorHsv;

        const harmonies = {
            Complementaria: [hsvToHex(h,s,v), hsvToHex((h + 180) % 360, s, v)],
            Análoga: [hsvToHex((h + 330) % 360, s, v), hsvToHex(h,s,v), hsvToHex((h + 30) % 360, s, v)],
            Triádica: [hsvToHex(h,s,v), hsvToHex((h + 120) % 360, s, v), hsvToHex((h + 240) % 360, s, v)],
            Tetrádica: [hsvToHex(h,s,v), hsvToHex((h + 60) % 360, s, v), hsvToHex((h + 180) % 360, s, v), hsvToHex((h + 240) % 360, s, v)]
        };

        palettesContainer.innerHTML = '';
        for (const name in harmonies) {
            const paletteDiv = document.createElement('div');
            paletteDiv.className = 'palette';
            
            let colorsHTML = harmonies[name].map(hex => `<div class="palette-color" style="background-color: ${hex}"></div>`).join('');
            
            paletteDiv.innerHTML = `
                <h3>${name}</h3>
                <div class="palette-colors">${colorsHTML}</div>
            `;
            palettesContainer.appendChild(paletteDiv);
        }
    }
    colorPicker.addEventListener('input', generateHarmonies);
    generateHarmonies(); // Llamada inicial

    // --- LÓGICA DE PSICOLOGÍA DEL COLOR ---
    const psychologyGrid = document.querySelector('.psychology-grid');
    const psychologyData = [
        { color: 'Rojo', hex: '#FF0000', text: 'Energía, pasión, peligro, fuerza, amor.', textColor: 'white' },
        { color: 'Azul', hex: '#0000FF', text: 'Calma, confianza, serenidad, lealtad.', textColor: 'white' },
        { color: 'Verde', hex: '#008000', text: 'Naturaleza, crecimiento, armonía, frescura.', textColor: 'white' },
        { color: 'Amarillo', hex: '#FFFF00', text: 'Felicidad, optimismo, energía, advertencia.', textColor: 'black' },
        { color: 'Naranja', hex: '#FFA500', text: 'Entusiasmo, creatividad, éxito, calidez.', textColor: 'black' },
        { color: 'Morado', hex: '#800080', text: 'Lujo, poder, nobleza, misterio.', textColor: 'white' },
        { color: 'Negro', hex: '#000000', text: 'Elegancia, poder, formalidad, muerte.', textColor: 'white' },
        { color: 'Blanco', hex: '#FFFFFF', text: 'Pureza, inocencia, limpieza, simplicidad.', textColor: 'black' }
    ];

    psychologyData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'psychology-card';
        card.style.setProperty('--card-color', item.hex);
        card.style.setProperty('--card-text-color', item.textColor);
        card.innerHTML = `<strong>${item.color}</strong>`;
        card.addEventListener('click', () => {
            alert(`${item.color}: ${item.text}`);
        });
        psychologyGrid.appendChild(card);
    });

    // --- FOOTER AÑO ACTUAL ---
    document.getElementById('year').textContent = new Date().getFullYear();
});