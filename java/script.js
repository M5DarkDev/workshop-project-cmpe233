function calculatePrice() {
    // Define base prices per day
    const presenterDailyRate = 100;
    const audienceDailyRate = 75;

    // Get participant type
    // Use optional chaining (?.) and nullish coalescing (??) for safer access
    const participantTypeElement = document.querySelector('input[name="participantType"]:checked');
    const participantType = participantTypeElement ? participantTypeElement.value : 'audience'; // Default to audience if none checked
    const dailyBasePrice = participantType === 'presenter' ? presenterDailyRate : audienceDailyRate;

    // Get selected sessions (checkboxes)
    const selectedSessions = document.querySelectorAll('input[type="checkbox"]:checked');
    const numSelectedSessions = selectedSessions.length;

    // Get and validate dates
    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');
    const fromDate = new Date(fromDateInput.value);
    const toDate = new Date(toDateInput.value);

    // Improved date validation: Check if inputs have values AND if parsed dates are valid
    if (!fromDateInput.value || !toDateInput.value || isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) || fromDate > toDate) {
        // Clear previously displayed costs and details if dates are invalid
        document.querySelectorAll('.item-cost').forEach(input => input.value = '');
        document.getElementById('totalCost').value = '0 (€)';
        document.getElementById('calculationDetails').innerHTML = '';
        return; // Stop the function if dates are invalid
    }

    // Calculate number of days between dates (inclusive)
    const timeDiff = toDate - fromDate;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    // Calculate cost for each selected session
    let totalSessionCost = 0;
    const sessionBaseCostPerDay = dailyBasePrice; // Base cost per session is the daily rate

    // Clear previous item costs
    document.querySelectorAll('.item-cost').forEach(input => input.value = '');

    selectedSessions.forEach(sessionCheckbox => {
        const sessionId = sessionCheckbox.id;
        // Assuming each session costs the daily rate multiplied by the number of days
        const sessionCost = days * sessionBaseCostPerDay;
        totalSessionCost += sessionCost;

        // Display cost for this session
        const costInputId = 'cost-' + sessionId;
        const costInput = document.getElementById(costInputId);
        if (costInput) {
            costInput.value = sessionCost.toFixed(2) + ' (€)';
        }
    });

    // Get participants for group discount
    const participantsInput = document.getElementById('participants');
    const participants = parseInt(participantsInput.value);

    if (isNaN(participants) || participants < 1) {
        alert('Please enter a valid number of participants.');
        document.getElementById('totalCost').value = '0 (€)';
        document.getElementById('calculationDetails').innerHTML = '';
        return; // Stop the function if participants is invalid
    }

    // Calculate subtotal (total session cost multiplied by participants)
    const subtotal = totalSessionCost * participants;

    // Apply discount
    let discount = participants >= 4 ? subtotal * 0.10 : 0;
    const total = subtotal - discount;

    // Display total cost
    document.getElementById('totalCost').value = total.toFixed(2) + ' (€)';

    // Display calculation details
    const calculationDetailsElement = document.getElementById('calculationDetails');
    let detailsHTML = `
        <p><b>Participant Type:</b> ${participantType.charAt(0).toUpperCase() + participantType.slice(1)} (€${dailyBasePrice}/day)</p>
        <p><b>Number of Days:</b> ${days}</p>
        <p><b>Selected Sessions:</b> ${numSelectedSessions}</p>
        <p><b>Cost per selected session:</b> ${days} days * €${dailyBasePrice}/day = €${(days * dailyBasePrice).toFixed(2)}</p>
        <p><b>Total Session Cost:</b> ${numSelectedSessions} sessions * €${(days * dailyBasePrice).toFixed(2)}/session = €${totalSessionCost.toFixed(2)}</p>
        <p><b>Number of Participants:</b> ${participants}</p>
        <p><b>Subtotal (before discount):</b> €${subtotal.toFixed(2)}</p>
    `;
    if (discount > 0) {
        detailsHTML += `<p><b>Group Discount (10%):</b> -€${discount.toFixed(2)}</p>`;
    }
    detailsHTML += `<p style="font-size: 28px; font-weight: bold; text-align: center;">Total: €${total.toFixed(2)}</p>`;

    calculationDetailsElement.innerHTML = detailsHTML;
}

function confirmation() {
    let userConfirmation = confirm("Are you accepting the calculation?");
    if (userConfirmation) {
        alert("Thanks for the purchase!");
    } else {
        alert("The payment was declined!");
    }
}

// Initial calculation on page load (to show default values)
document.addEventListener('DOMContentLoaded', () => {
    
    calculatePrice(); // Perform initial calculation on page load
});