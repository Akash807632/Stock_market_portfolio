import React from 'react'
import { useContext, useState } from 'react'
import { useEffect, useRef } from 'react';
import StockContext from '../context/StockContext'
import Stockitem from './Stockitem'
// import Addnote from './Addnote';
// import { useNavigate } from 'react-router-dom';

export default function Stock(props) {
    const context = useContext(StockContext)
    //   let navigate = useNavigate();
    const { stocks, getAllStock } = context
    //   const { Aleartset } = props
    // const [stock, setstock] = useState({ Symbol: '', name: '', quantity: '', purchasePrice: '', currentPrice: '' })
    useEffect(() => {
      getAllStock();
    }, [])
  
    return (
        <>
            <div className="container row my-3">
                <h2>Your Stock</h2>
                <div className="container"> {stocks.length === 0 && "no stocks"}</div>
                {stocks.map((stock) => {
                    return <Stockitem  stock={stock} key={stock.symbol}/>
                })}
            </div>
      
    </>
  )
}
