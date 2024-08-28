//wait untill the Dom content is fully loaded
document.addEventListener("DOMContentLoaded",() =>{
    //get all the reference to the DOM element
    const entryList = document.getElementById("entry-list");
    const totalIncome = document.getElementById("total-income");
    const totalExpenses = document.getElementById("total-expenses");
    const netBalance = document.getElementById("net-balance");
    const addEntryButton = document.getElementById("add-entry");
    const updateEntryButton = document.getElementById("update-entry");
    const descriptionInput = document.getElementById("description");
    const amountInput = document.getElementById("amount");
    const typeSelect = document.getElementById("type");
    const filterRadios = document.querySelectorAll('input[name="filter"]');


    //load the entries from the local storage or initialize as empty array
    let entries = JSON.parse(localStorage.getItem('entries')) || [];

    let editingIndex = -1;//index of the entry being edited

    //function to calculate and update totals

    const calculateTotals = () =>{
        let income =0;
        let expenses=0;
        entries.forEach(entry =>{
            if(entry.type ==='income'){
                income += parseFloat(entry.amount);
            }else {
                expenses += parseFloat(entry.amount);
            }
        });
        totalIncome.textContent = income.toFixed(2);
        totalExpenses.textContent = expenses.toFixed(2);
        netBalance.textContent=(income-expenses).toFixed(2);

    };


    //function to render entries based on the filter

    const renderEntries = (filter = 'all') => {
        entryList.innerHTML ='';//clearing the existing list
        entries.filter(entry => filter === 'all' || entry.type === filter )
        .forEach((entry, index)=>{
            const li =document.createElement('li');
            li.innerHTML = `
            ${entry.description} = ${entry.amount} (${entry.type})
            <button  onclick="editEntry(${index})" style ="background-color: crimson;"> Edit </button>
              <button class="delete-btn" onclick="deleteEntry(${index})" style="background-color: green;"> delete </button>`
             entryList.appendChild(li);

        });
        calculateTotals();

    };
//function to add entry
const addEntry = () =>{
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type=typeSelect.value;

    //validate input fields

    if(description && !isNaN(amount) && amount > 0){
        if(editingIndex > -1){
            entries[editingIndex] = {description,amount,type};
            editingIndex = -1;
            addEntryButton.style.display = "inline";
            updateEntryButton.style.display = "none";


        } else {
            entries.push({description,amount,type});
        }
        localStorage.setItem("entries", JSON.stringify(entries));
        renderEntries ();

        //clear the input fields
        descriptionInput.value = '';
        amountInput.value = '';
        typeSelect.value = 'income'
    }
};


//function to edit entry

    window.editEntry = (index) =>{
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeSelect.value = entry.type;
    editingIndex = index;
    addEntryButton.style.display ="none";
    updateEntryButton.style.display ="inline";

};

//function to delete the entry
 
window.deleteEntry = (index) => {
    entries.splice(index, 1); //remove the entry from array
    localStorage.setItem('entries',JSON.stringify(entries));
    renderEntries()
}


//Event listener for add entry

addEntryButton.addEventListener('click',addEntry)

//Event listener for update entry

updateEntryButton.addEventListener('click',addEntry)

//event listener for filter changes

filterRadios.forEach(radio =>{
    radio.addEventListener('change', () =>{
        renderEntries(radio.value);
    })
})


//initial rendering of entries
renderEntries()

})


