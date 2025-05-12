function calculatePrice() {
            // Get selected sessions
            const sessions = parseInt(document.querySelector('input[name="sessions"]:checked').value);

            // Get add-ons
            const nutrition = document.getElementById('nutrition').checked ? 100 : 0;
            const starterKit = document.getElementById('starter-kit').checked ? 50 : 0;

            // Get participants
            const participants = parseInt(document.getElementById('participants').value);

            // Calculate base price
            const sessionPrice = sessions * 75;
            const addonsPrice = nutrition + starterKit;
            const perPersonPrice = sessionPrice + addonsPrice;
            let total = perPersonPrice * participants;

            // Apply discount
            let discount = 0;
            if (participants >= 4) {
                discount = total * 0.10;
                total -= discount;
            }

            // Display results
            const resultElement = document.getElementById('result');
            resultElement.innerHTML = `
        <div style="font-weight: bold; background: none;">Base Price: €${perPersonPrice} × ${participants} people = €${(perPersonPrice * participants).toFixed(2)}</div>
        ${discount > 0 ? `
            <div style="color: #28a745; font-weight: bold; background: none;">
                Discount: -€${discount.toFixed(2)}
            </div>
        ` : ''}
        <div style="font-weight: bold;  background: none;">
            Total Price: €${total.toFixed(2)}
        </div>
    `;
        }
