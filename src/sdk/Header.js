import React, {useState} from "react";
//import "../index.scss";
//import './App.css';
//import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap";
import logo from "./img/radiance logo.png";
import {
	HashRouter as Router,
	Switch,
	Route,
	useHistory,
} from "react-router-dom";
import ConnectWalletPage from "./ConnectWalletPage";
import {useDispatch, useSelector} from "react-redux";

import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";

const CONTRACT_NAME = "dev-1646972874579-36142488542328";

const nearConfig = {
	networkId: "testnet",
	nodeUrl: "https://rpc.testnet.near.org",
	contractName: CONTRACT_NAME,
	walletUrl: "https://wallet.testnet.near.org",
	helperUrl: "https://helper.testnet.near.org",
};

const {connect, keyStores, WalletConnection} = nearAPI;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

const config = {
	networkId: "testnet",
	keyStore, // optional if not signing transactions
	nodeUrl: "https://rpc.testnet.near.org",
	walletUrl: "https://wallet.testnet.near.org",
	helperUrl: "https://helper.testnet.near.org",
	explorerUrl: "https://explorer.testnet.near.org",
};

function Header({activeCat}) {
	let history = useHistory();

	const [openMenu, setOpenMenu] = useState(false);

	const [mobMenu, setMobMenu] = useState(false);

	const dispatch = useDispatch();

	const connectWallet = useSelector((state) => state.connectWallet);

	function logOut(e) {
		walletConnection.signOut();
	}

	async function connectNear() {
		console.log(1);

		window.near = await nearAPI.connect({
			deps: {
				keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
			},
			...nearConfig,
		});

		// Needed to access wallet login
		window.walletConnection = new nearAPI.WalletConnection(window.near);

		// Initializing our contract APIs by contract name and configuration.
		window.contract1 = await new nearAPI.Contract(
			window.walletConnection.account(),
			nearConfig.contractName,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: ["nft_metadata", "nft_supply_for_owner", "nft_tokens"],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["nft_mint", "new_default_meta", "new", "mint"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);
	}

	function connectWal() {
		walletConnection.requestSignIn(CONTRACT_NAME, "Test Contract");
	}

	const [walletAddress, setWalletAddress] = useState();

	window.nearInitPromise = connectNear().then(() => {
		try {
			setWalletAddress(walletConnection.getAccountId());
		} catch {
			setWalletAddress(undefined);
		}
		console.log(walletAddress);
	});

	function initContract() {
		contract1.new_default_meta({owner_id: "blender.testnet"});
	}

	function test123() {
		contract1
			.nft_supply_for_owner({account_id: "blender.testnet"})
			.then((data) => {
				console.log(data);
			});
		contract1.nft_tokens({from_index: "0", limit: 50}).then((data) => {
			console.log(data);
		});
	}

	function contractF() {
		console.log(1);
		contract1
			.nft_mint(
				{
					token_id: "1",
					receiver_id: "blender.testnet",
					token_metadata: {
						title: "Olympus Mons",
						description: "Tallest mountain in charted solar system",
						media:
							"https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Olympus_Mons_alt.jpg/1024px-Olympus_Mons_alt.jpg",
						copies: 1,
					},
				},
				"30000000000000",
				"7090000000000000000000",
			)
			.then((data) => {
				console.log(data);
			});
	}

	function contractP() {
		contract1.nft_metadata().then((data) => {
			console.log(data);
		});
	}

	function test321() {
		console.log(walletConnection.getAccountId());
	}

	function new_init() {
		contract1
			.new({
				owner_id: window.walletConnection.getAccountId(),
				metadata: {
					spec: "nft-1.0.0",
					name: "NFT Contract test",
					symbol: "RTEAMTEST",
					icon: null,
					base_uri: null,
					reference: null,
					reference_hash: null,
				},
			})
			.then((data) => {
				console.log(data);
			});
	}

	function mint_new() {
		contract1
			.nft_mint(
				{
					token_id: "2",
					metadata: {
						title: "Olympus Mons11111111",
						description: "Tallest mountain in charted solar system",
						media:
							"https://www.abisoft.ru/upload/iblock/12a/12a6eeadebe9565939234b1747c36c51.jpg",
						copies: 1,
					},
					receiver_id: "blender.testnet",
				},
				"30000000000000",
				"7490000000000000000000",
			)
			.then((data) => {
				console.log(data);
			});
	}

	return (
		<Router>
			<div className="header header2">
				<div className="container-header">
					<div className="acc-info">
						<div className={mobMenu ? "hide" : "acc-info1"}>
							<a href="#/">
								<div class="name">NFTour</div>
							</a>
							{localStorage.undefined_wallet_auth_key ? (
								<div class="wallet">
									<div className="acc-status">Connected:</div>
									<div className="acc-wallet">{walletAddress}</div>
									<div
										className={
											openMenu ? "btn-menu btn-menu-active" : "btn-menu"
										}
										onClick={() => setOpenMenu(!openMenu)}
									></div>

									<div className={openMenu ? "menu-info" : "hide"}>
										<a
											onClick={(ev) => {
												ev.preventDefault();
												history.push("/profile/" + walletAddress);
											}}
										>
											Your Profile
										</a>
										<a onClick={logOut}>Log out</a>
									</div>

									{/* <button onClick={new_init}>init Collection</button>
									<button onClick={mint_new}>mint Collection</button> */}
								</div>
							) : (
								<div class="wallet">
									<div class="button-1-square" onClick={connectWal}>
										Connect
									</div>

									{/* <button onClick={test321}>test</button> */}
									{/* <button onClick={initContract}>init Call</button>
									<button onClick={contractF}>contract Call</button>
									<button onClick={contractP}>contract View</button>
									<button onClick={test123}>view1</button> */}
								</div>
							)}
						</div>

						<div class="pages">
							<a href="#/">
								<div
									className={
										activeCat == 0 ? "page-element active" : "page-element"
									}
								>
									Home
								</div>
							</a>
							<a href="#/load-nft">
								<div
									className={
										activeCat == 1 ? "page-element active" : "page-element"
									}
								>
									NFT Generator
								</div>
							</a>
							<a href="#/collection-market">
								<div
									className={
										activeCat == 2 ? "page-element active" : "page-element"
									}
								>
									NFT Collection Market
								</div>
							</a>
							<div class="page-element">FAQ</div>
						</div>

						<div className={mobMenu ? "pages-m pages-m-active" : "pages-m"}>
							<a href="#/">
								<div
									className={
										activeCat == 0 ? "page-element active" : "page-element"
									}
								>
									Home
								</div>
							</a>
							<a href="#/load-nft">
								<div
									className={
										activeCat == 1 ? "page-element active" : "page-element"
									}
								>
									NFT Generator
								</div>
							</a>
							<a href="#/collection-market">
								<div
									className={
										activeCat == 2 ? "page-element active" : "page-element"
									}
								>
									NFT Collection Market
								</div>
							</a>
							<a>
								<div class="page-element">FAQ</div>
							</a>

							<span
								onClick={() => setMobMenu(!mobMenu)}
								className={mobMenu ? "menu-m menu-m-active" : "menu-m"}
							></span>
						</div>
					</div>
				</div>
			</div>

			<div className={connectWallet ? "" : "hide"}>
				<ConnectWalletPage></ConnectWalletPage>
			</div>
		</Router>
	);
}

export default Header;
