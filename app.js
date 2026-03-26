        function toggleProAddress(show) {
            const section = document.getElementById('pro-address-section');
            if (show) section.classList.add('visible'); else section.classList.remove('visible');
        }

        const rows = document.querySelectorAll('.item-row');
        const synthesis = document.getElementById('synthesis-text');
        const hTotal = document.getElementById('hidden-total');
        const hList = document.getElementById('hidden-list');

        function calculate() {
            let total = 0, qty = 0, list = "";
            rows.forEach(row => {
                const val = parseInt(row.querySelector('.qty-val').innerText);
                if (val > 0) {
                    total += val * parseInt(row.dataset.price);
                    qty += val;
                    list += val + "x " + row.dataset.name + ", ";
                }
            });
            synthesis.innerText = qty > 0 ? `Estimation (${qty} outil${qty > 1 ? 's' : ''}) : ${total} €` : "Aucun outil sélectionné";
            hTotal.value = total + " €"; 
            hList.value = list.replace(/, $/, ""); 
        }

        rows.forEach(row => {
            row.querySelector('.plus').onclick = (e) => { 
                e.preventDefault();
                row.querySelector('.qty-val').innerText++; 
                calculate(); 
            };
            row.querySelector('.minus').onclick = (e) => { 
                e.preventDefault();
                let val = parseInt(row.querySelector('.qty-val').innerText);
                if (val > 0) { 
                    row.querySelector('.qty-val').innerText = val - 1; 
                    calculate(); 
                }
            };
        });