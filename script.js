document.addEventListener('DOMContentLoaded', function () {

    // Comprueba si estamos en la página del Círculo Cromático
    const colorWheelSection = document.getElementById('color-wheel-section');
    if (colorWheelSection) {
        const colorWheel = colorWheelSection.querySelector('.color-wheel');
        const tooltip = colorWheelSection.querySelector('#tooltip');
        const colors = [ { name: 'Cian', type: 'Primario', hex: '#00FFFF' }, { name: 'Verde Cian', type: 'Terciario', hex: '#00FF80' }, { name: 'Verde', type: 'Secundario', hex: '#00FF00' }, { name: 'Lima', type: 'Terciario', hex: '#80FF00' }, { name: 'Amarillo', type: 'Primario', hex: '#FFFF00' }, { name: 'Naranja', type: 'Terciario', hex: '#FF8000' }, { name: 'Rojo', type: 'Secundario', hex: '#FF0000' }, { name: 'Rosa', type: 'Terciario', hex: '#FF0080' }, { name: 'Magenta', type: 'Primario', hex: '#FF00FF' }, { name: 'Violeta', type: 'Terciario', hex: '#8000FF' }, { name: 'Azul-Violeta', type: 'Secundario', hex: '#4000FF' }, { name: 'Azul Cerúleo', type: 'Terciario', hex: '#0080FF' } ];
        const angle = (2 * Math.PI) / 12; const x = 50 + 50 * Math.tan(angle / 2); const clipPath = `polygon(50% 50%, 50% 0, ${x}% 0)`;
        colors.forEach((color, i) => {
            const slice = document.createElement('div'); slice.className = 'color-slice'; const rotation = i * 30;
            slice.style.backgroundColor = color.hex; slice.style.clipPath = clipPath; slice.style.transform = `rotate(${rotation}deg)`; slice.style.setProperty('--rotation', `${rotation}deg`);
            slice.addEventListener('mouseover', () => { tooltip.innerHTML = `<strong>${color.name}</strong><br>(${color.type})`; tooltip.classList.add('visible'); });
            slice.addEventListener('mouseout', () => { tooltip.classList.remove('visible'); });
            colorWheel.appendChild(slice);
        });
    }

    // Comprueba si estamos en la página de Propiedades
    const propertiesSection = document.getElementById('properties-section');
    if (propertiesSection) {
        const hueSlider = document.getElementById('hue-slider'), saturationSlider = document.getElementById('saturation-slider'), valueSlider = document.getElementById('value-slider'), colorPreview = document.getElementById('color-preview'), colorValues = document.getElementById('color-values');
        function updateColorPreview() { const h = hueSlider.value, s = saturationSlider.value, v = valueSlider.value; let s_norm = s / 100, v_norm = v / 100, c = v_norm * s_norm, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v_norm - c, r_prime, g_prime, b_prime; if (h >= 0 && h < 60) { [r_prime, g_prime, b_prime] = [c, x, 0]; } else if (h >= 60 && h < 120) { [r_prime, g_prime, b_prime] = [x, c, 0]; } else if (h >= 120 && h < 180) { [r_prime, g_prime, b_prime] = [0, c, x]; } else if (h >= 180 && h < 240) { [r_prime, g_prime, b_prime] = [0, x, c]; } else if (h >= 240 && h < 300) { [r_prime, g_prime, b_prime] = [x, 0, c]; } else { [r_prime, g_prime, b_prime] = [c, 0, x]; } const [r, g_val, b] = [(r_prime + m) * 255, (g_prime + m) * 255, (b_prime + m) * 255]; colorPreview.style.backgroundColor = `rgb(${r}, ${g_val}, ${b})`; colorValues.innerHTML = `<strong>HSV:</strong> ${h}, ${s}%, ${v}%<br><strong>RGB:</strong> ${Math.round(r)}, ${Math.round(g_val)}, ${Math.round(b)}`; }
        [hueSlider, saturationSlider, valueSlider].forEach(slider => slider.addEventListener('input', updateColorPreview)); updateColorPreview();
    }

    // Comprueba si estamos en la página de Armonías
    const harmoniesSection = document.getElementById('harmonies-section');
    if (harmoniesSection) {
        const colorPicker = document.getElementById('harmony-color-picker'); const palettesContainer = document.getElementById('harmony-palettes');
        function hexToHsv(hex) { let r = 0, g = 0, b = 0; r = parseInt(hex.substring(1, 3), 16) / 255; g = parseInt(hex.substring(3, 5), 16) / 255; b = parseInt(hex.substring(5, 7), 16) / 255; let max = Math.max(r, g, b), min = Math.min(r, g, b); let h, s, v = max; let d = max - min; s = max == 0 ? 0 : d / max; if (max == min) { h = 0; } else { switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; } h /= 6; } return { h: h * 360, s: s * 100, v: v * 100 }; }
        function hsvToHex(h, s, v) { s /= 100; v /= 100; let c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c, r_prime, g_prime, b_prime; if (h >= 0 && h < 60) { [r_prime, g_prime, b_prime] = [c, x, 0]; } else if (h >= 60 && h < 120) { [r_prime, g_prime, b_prime] = [x, c, 0]; } else if (h >= 120 && h < 180) { [r_prime, g_prime, b_prime] = [0, c, x]; } else if (h >= 180 && h < 240) { [r_prime, g_prime, b_prime] = [0, x, c]; } else if (h >= 240 && h < 300) { [r_prime, g_prime, b_prime] = [x, 0, c]; } else { [r_prime, g_prime, b_prime] = [c, 0, x]; } let toHex = (val) => Math.round(val * 255).toString(16).padStart(2, '0'); return `#${toHex(r_prime + m)}${toHex(g_prime + m)}${toHex(b_prime + m)}`; }
        function generateHarmonies() { const baseColorHsv = hexToHsv(colorPicker.value); const { h, s, v } = baseColorHsv; const harmonies = { Complementaria: [hsvToHex(h, s, v), hsvToHex((h + 180) % 360, s, v)], Análoga: [hsvToHex((h + 330) % 360, s, v), hsvToHex(h, s, v), hsvToHex((h + 30) % 360, s, v)], Triádica: [hsvToHex(h, s, v), hsvToHex((h + 120) % 360, s, v), hsvToHex((h + 240) % 360, s, v)], Tetrádica: [hsvToHex(h, s, v), hsvToHex((h + 60) % 360, s, v), hsvToHex((h + 180) % 360, s, v), hsvToHex((h + 240) % 360, s, v)] }; palettesContainer.innerHTML = ''; for (const name in harmonies) { const paletteDiv = document.createElement('div'); paletteDiv.className = 'palette'; let colorsHTML = harmonies[name].map(hex => `<div class="palette-color" style="background-color: ${hex}"></div>`).join(''); paletteDiv.innerHTML = `<h3>${name}</h3><div class="palette-colors">${colorsHTML}</div>`; palettesContainer.appendChild(paletteDiv); } }
        colorPicker.addEventListener('input', generateHarmonies); generateHarmonies();
    }

    // Comprueba si estamos en la página de Psicología
    const psychologySection = document.getElementById('psychology-section');
    if (psychologySection) {
        const psychologyGrid = psychologySection.querySelector('.psychology-grid');
        const psychologyData = [{ color: 'Rojo', hex: '#FF0000', text: 'Energía, pasión, peligro, fuerza, amor.', textColor: 'white' }, { color: 'Azul', hex: '#0000FF', text: 'Calma, confianza, serenidad, lealtad.', textColor: 'white' }, { color: 'Verde', hex: '#008000', text: 'Naturaleza, crecimiento, armonía, frescura.', textColor: 'white' }, { color: 'Amarillo', hex: '#FFFF00', text: 'Felicidad, optimismo, energía, advertencia.', textColor: 'black' }, { color: 'Naranja', hex: '#FFA500', text: 'Entusiasmo, creatividad, éxito, calidez.', textColor: 'black' }, { color: 'Morado', hex: '#800080', text: 'Lujo, poder, nobleza, misterio.', textColor: 'white' }, { color: 'Negro', hex: '#000000', text: 'Elegancia, poder, formalidad, muerte.', textColor: 'white' }, { color: 'Blanco', hex: '#FFFFFF', text: 'Pureza, inocencia, limpieza, simplicidad.', textColor: 'black' }];
        psychologyData.forEach(item => { const card = document.createElement('div'); card.className = 'psychology-card'; card.style.setProperty('--card-color', item.hex); card.style.setProperty('--card-text-color', item.textColor); card.innerHTML = `<strong>${item.color}</strong>`; card.addEventListener('click', () => { alert(`${item.color}: ${item.text}`); }); psychologyGrid.appendChild(card); });
    }

    // Código común a todas las páginas (Footer)
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});