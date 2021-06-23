import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from 'react-redux';
import {hideClientWalletsFromSelect} from '../../store/actions/clientWallets';
import CloseBtn from '../CloseBtn/CloseBtn';
import Loader from '../Loader/Loader';
import MainBlock from "../MainBlock/MainBlock";
import SearchInput from '../SearchInput/SearchInput';
import Item from '../Item/Item';
import './ClientWallets.scss';
import {getAllClientWallets, subscribe} from "../../extensions/webhook/script";
import {setLiquidityList, setTokenList} from "../../store/actions/wallet";

function ClientWallets(props) {

    const dispatch = useDispatch();
    const [filter, setFilter] = useState('');

    const wallet = useSelector(state => state.walletReducer.wallet);

    const tokenList = useSelector(state => state.walletReducer.tokenList);
    const LPTokenList = useSelector(state => state.walletReducer.liquidityList);
console.log("tokenList",tokenList,"LPTokenList",LPTokenList)

    const [at,setAT] = useState(toArray(tokenList, LPTokenList))
    function toArray(tokenList2, LPTokenList2){
        let toArr = [];
        tokenList2.map((i) => {
            toArr.push({
                symbol: i.symbol,
                balance: i.balance,
                walletAddress: i.walletAddress,
                lp: false
            })
        })
        LPTokenList2.map((i) => {
            toArr.push({
                symbol: i.symbol,
                balance: i.balance,
                walletAddress: i.walletAddress,
                lp: true
            })
        })
        return toArr
    }

    //console.log(LPTokenList);

useEffect(async ()=>{
    let allWallets = await getAllClientWallets(wallet && wallet.id)
if(allWallets.length > (tokenList.length + LPTokenList.length)){
    setAT(allWallets)

    allWallets.forEach(async item => await subscribe(item.walletAddress));

    let liquidityListST = tokenList.filter(i => i.symbol.includes('/'));

    let tokenListST = tokenList.filter(i => !i.symbol.includes('/')).map(i => (
        {
            ...i,
            symbol: i.symbol === 'WTON' ? 'TON' : i.symbol
        })
    );

    localStorage.setItem('tokenList', JSON.stringify(tokenListST));
    localStorage.setItem('liquidityList', JSON.stringify(liquidityListST));
    dispatch(setTokenList(tokenListST));
    dispatch(setLiquidityList(liquidityListST));

}



},[])
    function handleClose() {
        return dispatch(hideClientWalletsFromSelect())
    }

    return ReactDOM.createPortal(
        <div className="select-wrapper">
            <MainBlock
                title={'User wallets'}

                button={<CloseBtn func={handleClose}/>}
                content={
                    !tokenList.length && !LPTokenList.length ?  <p className="wallet-ballance">You have not wallets yet</p> :
                        (<>
                            <SearchInput func={setFilter.bind(this)}/>
                            <div className="select-list">
                                {at
                                    .sort((a, b) => b.balance - a.balance)
                                    .filter(item => item.symbol.toLowerCase().includes(filter.toLowerCase()))
                                    .map(item => (
                                        <Item
                                            walletAddress={item.walletAddress}
                                            symbol={item.symbol}
                                            balance={item.balance}
                                            lp={item.lp}
                                            key={item.symbol}
                                        />
                                    ))
                                }
                            </div>
                        </>)
                }
            />

        </div>,
        document.querySelector('body')
    );
}

export default ClientWallets;
