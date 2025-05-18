function calculatePrice() {
    // Daily prices based on participant type
    const presenterDailyRate = 100;
    const audienceDailyRate = 75;

    // Get participant type (default to 'audience' if none selected)
    const participantTypeElement = document.querySelector('input[name="participantType"]:checked');
    const participantType = participantTypeElement ? participantTypeElement.value : 'audience';
    const dailyBasePrice = participantType === 'presenter' ? presenterDailyRate : audienceDailyRate;

    // Get all selected sessions (checkboxes that are checked)
    const selectedSessions = document.querySelectorAll('input[type="checkbox"]:checked');
    const numSelectedSessions = selectedSessions.length;

    // Get the start and end dates
    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');
    const fromDate = new Date(fromDateInput.value);
    const toDate = new Date(toDateInput.value);

    // Check if dates are filled in and make sense
    if (!fromDateInput.value || !toDateInput.value || isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) || fromDate > toDate) {
        // If dates are invalid, clear everything and stop
        document.querySelectorAll('.item-cost').forEach(input => input.value = '');
        document.getElementById('totalCost').value = '0 (€)';
        document.getElementById('calculationDetails').innerHTML = '';
        return;
    }

    // Calculate how many days total (including start and end)
    const timeDiff = toDate - fromDate;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    // Start total session cost at 0
    let totalSessionCost = 0;
    const sessionBaseCostPerDay = dailyBasePrice;

    // Clear previous session costs
    document.querySelectorAll('.item-cost').forEach(input => input.value = '');

    // Loop through each selected session and calculate its cost
    selectedSessions.forEach(sessionCheckbox => {
        const sessionId = sessionCheckbox.id;
        const sessionCost = days * sessionBaseCostPerDay;
        totalSessionCost += sessionCost;

        // Show session cost in the related input field
        const costInputId = 'cost-' + sessionId;
        const costInput = document.getElementById(costInputId);
        if (costInput) {
            costInput.value = sessionCost.toFixed(2) + ' (€)';
        }
    });

    // Get number of participants
    const participantsInput = document.getElementById('participants');
    const participants = parseInt(participantsInput.value);

    if (isNaN(participants) || participants < 1) {
        alert('Please enter a valid number of participants.');
        document.getElementById('totalCost').value = '0 (€)';
        document.getElementById('calculationDetails').innerHTML = '';
        return;
    }

    // Total before discount
    const subtotal = totalSessionCost * participants;

    // Apply 10% discount if group has 4 or more people
    let discount = participants >= 4 ? subtotal * 0.10 : 0;
    const total = subtotal - discount;

    // Show total in input field
    document.getElementById('totalCost').value = total.toFixed(2) + ' (€)';

    // Show detailed breakdown of the calculation
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

// Run the calculation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    calculatePrice();
});
