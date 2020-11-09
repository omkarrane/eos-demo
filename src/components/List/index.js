import React, { useState } from 'react'
import { JsonRpc } from 'eosjs'

const api = new JsonRpc('https://eos.greymass.com')

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

async function delay(fn, ...args) {
  // await timeout(1000)
  return fn(...args)
}

const getBlockId = async () => {
  try {
    const blockInfo = await api.get_info()
    return blockInfo.head_block_num
  } catch (err) {
    throw err.message
  }
}

async function getBlockInfo(blockId) {
  try {
    const blocks = await api.get_block(blockId)
    return blocks
  } catch (err) {
    throw err.message
  }
}

function List(props) {
  const [blocks, setBlocks] = useState([])
  const [show, setShow] = useState(false)

  async function fetchData() {
    console.log("fetching data")
    setBlocks([])
    let length = 10
    let data = []

    while (length--) {
      await delay(async () => {
        let blkId;
        if (!data.length) {
          blkId = await getBlockId()
          const block = await getBlockInfo(blkId)
          data.unshift(block)
        }
        else {
          blkId = data[data.length - 1].previous
          const block = await getBlockInfo(blkId)
          data.push(block)
        }
      })
    }

    setBlocks(data)
    setShow(true)
  }

  return (
    <div>
      <button className="fetch-button" onClick={fetchData}>
        Fetch Data
      </button>
      {show && <DisplayBlocks blocks={blocks} />}
    </div>
  )
}

function DisplayBlocks(props) {
  const blocks = props.blocks
  let data = '';

  const displayExtraData = (block) => {
    console.log(block)
    data = JSON.stringify(block)
    alert(data)
  }

  const list = blocks.map(e =>
    <li key={e.id} onClick={displayExtraData.bind(null, e)}>
      {e.producer} - {e.id}
    </li>
  )
  return (
    <>
      <ul>
        {list}
      </ul>
    </>
  )
}

export default List