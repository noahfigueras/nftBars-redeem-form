const address = '0x50aDB1d3fb9fa3cc2383560D09b5E08027cEBB24';
const contractAbi = [
  "function balanceOf(address) view returns (uint)",
	"function tokenOfOwnerByIndex(address, uint) view returns (uint)"
];
let signer;
let contract;
console.log('Provider', provider);

// Initialize Metamask provider
function init() {
  const ethers = window.ethers;
  const Provider = new ethers.providers.Web3Provider(window.ethereum)
  signer = Provider.getSigner()
	contract = new ethers.Contract(address, contractAbi, Provider);
}

// Get token ids of user
async function tokensToRedeem() {
	try{
		let tokenIds = [];
		const addr = "0x5e079B2f1D98E07B4D53A5D0f6Ef5843235e8E15";// await signer.getAddress();
		const balance = await contract.balanceOf(addr);
		// Get tokenIds
		for(let i = 0; i < Number(balance); i++) {
			const id = await contract.tokenOfOwnerByIndex(addr,i);
			tokenIds.push(String(id));
		}	
		return tokenIds;
	} catch(err){
		console.log(err);
	}		
}

// Add tokenIds selection to form
async function populateForm() {
	const tokens = await tokensToRedeem();
	const addr = "0x5e079B2f1D98E07B4D53A5D0f6Ef5843235e8E15";// await signer.getAddress();
	const ul = document.querySelector("#add-token");		
	// Add address to form
	const form = document.querySelector("#redeemForm");		
	const input = document.createElement("input");
	input.setAttribute("type", "hidden");
	input.setAttribute("value", addr);
	form.append(input);
	// Populate user owned nfts 
	for(let value of tokens) {
	ul.insertAdjacentHTML('beforeend', `
		<li class="token-list-item">
			<label id="token" class="w-checkbox checkbox-field-bars">
				<div class="w-checkbox-input w-checkbox-input--inputType-custom checkbox">
				</div>
				<input type="checkbox" name="Token-ID-${value}" id="Token-ID-1" data-name="Token ID ${value}" value="${value}" style="opacity:0;position:absolute;z-index:-1">
				<span for="Token-ID-${value}" class="checkbox-label w-form-label">bitcoin bar<span class="label-small-span"><br>Token ID: ${value}</span></span>
				<div class="logo-wrap">
					<img src="https://uploads-ssl.webflow.com/60aeba699cbed144e00e4216/61ee2b09334fc99b8a382279_bar-sample%201.png" loading="lazy" alt="" class="image-4" width="48">
				</div>
			</label>
		</li>`);
	}
}

// Main entry point.
window.addEventListener('load', async () => {
  init();
	document.querySelector("#redeem").addEventListener("click", populateForm);
});

