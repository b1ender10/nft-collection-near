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

const CONTRACT_NAME = "dev-1646367380089-41389577714484";

const nearConfig = {
	networkId: "testnet",
	nodeUrl: "https://rpc.testnet.near.org",
	contractName: CONTRACT_NAME,
	walletUrl: "https://wallet.testnet.near.org",
	helperUrl: "https://helper.testnet.near.org",
};

function Header({activeCat}) {
	let history = useHistory();

	const [openMenu, setOpenMenu] = useState(false);

	const [mobMenu, setMobMenu] = useState(false);

	const dispatch = useDispatch();

	const connectWallet = useSelector((state) => state.connectWallet);

	function logOut(e) {
		e.preventDefault();
		console.log(1);
		sessionStorage.clear();
		location.reload();
	}

	function open() {
		dispatch({type: "openConnect"});
		console.log(connectWallet);
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
				viewMethods: ["nft_metadata"],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["nft_mint", "new_default_meta"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);
	}

	function connectWal() {
		walletConnection.requestSignIn(CONTRACT_NAME, "Rust Counter Example");
	}

	window.nearInitPromise = connectNear().then(() => {
		alert(1);
	});

	function initContract() {
		contract1.new_default_meta({owner_id: "blender.testnet"});
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

	return (
		<Router>
			<div className="header header2">
				<div className="container-header">
					<div className="acc-info">
						<div className={mobMenu ? "hide" : "acc-info1"}>
							<a href="#/">
								<div class="name">NFTour</div>
							</a>
							{sessionStorage.address ? (
								<div class="wallet">
									<div className="acc-status">Connected:</div>
									<div className="acc-wallet">{sessionStorage.address}</div>
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
												history.push(
													"/profile/" + sessionStorage.getItem("address"),
												);
											}}
										>
											Your Profile
										</a>
										<a onClick={logOut}>Log out</a>
									</div>
								</div>
							) : (
								<div class="wallet">
									<div class="button-1-square" onClick={connectWal}>
										Connect
									</div>
									<button onClick={initContract}>init Call</button>
									<button onClick={contractF}>contract Call</button>
									<button onClick={contractP}>contract View</button>
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
