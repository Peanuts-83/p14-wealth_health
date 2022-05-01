import '../style/view.css'
import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import { useEmployeesContext } from '../context/employeesCtx'
import { SimpleSelectMenu } from 'simple-select-menu'
import { Link } from 'react-router-dom'


const View = () => {
  const employeesCtx = useEmployeesContext()

  // SET menu components back to default once form is sent
  const [initSelect, setInitSelect] = useState(false)
  const initSct = { initSelect, setInitSelect }

  // DISPLAY & SEARCH table management
  const [allEmployees, setAllEmployees] = useState([...employeesCtx.employees])
  const [displayNum, setDisplayNum] = useState(10)
  const [displayPage, setDisplayPage] = useState(0)
  const [pagesArray, setPagesArray] = useState([1])
  const [results, setResults] = useState(allEmployees)
  const [searchLength, setSearchLength] = useState(0)

  // SORT table management
  const { setSortBy, setSortWay } = employeesCtx.setSorting
  const { sortBy, sortWay } = employeesCtx.sortInfo

  // SORT table by column & way
  useEffect(() => {

    // RESET sorting
    if (sortBy === null) {
      console.log('RESET SORT -', employeesCtx.employees.slice(0, 3));
      setAllEmployees([...employeesCtx.employees])
      return
    }

    // LAUNCH sorting
    setAllEmployees(allEmployees.sort((a, b) => {
      let valueA = a[sortBy]
      let valueB = b[sortBy]
      if (['street', 'city', 'stateName', 'zipCode'].includes(sortBy)) {
        valueA = a.address[sortBy]
        valueB = b.address[sortBy]
      }

      if (sortWay === 'up') {
        if (valueA < valueB) { return -1 }
        if (valueA > valueB) { return 1 }
        return 0
      } else if (sortWay === 'down') {
        if (valueA > valueB) { return -1 }
        if (valueA < valueB) { return 1 }
        return 0
      }
      return 0
    }))
  }, [sortBy, sortWay])


  // Define number of pages & results displayed on displayNum || displayPage change
  useEffect(() => {
    countPages()
    showResults(+displayNum)
    console.log(allEmployees.slice(0, 3));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayNum, displayPage, allEmployees, sortWay])

  // Set results displayed on the screen
  function showResults(len, results = allEmployees) {
    setResults(results.slice(displayPage * len, displayPage * len + len))
  }

  // Set number of pages depending on number of results per page & allEmployees' length
  function countPages() {
    setPagesArray([...Array(Math.ceil(allEmployees.length / displayNum))])
  }

  // Set page number active
  function selectPage(i) {
    document.querySelector('.active-page').classList.remove('active-page')
    document.querySelector(`#page-${i + 1}`).classList.add('active-page')
    setDisplayPage(i)
  }

  // Set number of results to display per page
  function changeDisplayNum(num) {
    selectPage(0)
    setDisplayPage(0)
    setDisplayNum(num)
  }

  // SEARCH table for value & FILTER table
  function searchData(e) {
    setSortBy(null)
    setSortWay(null)
    const target = e.target.value.toString().toLowerCase()

    if (target.length >= 3) {
      if (target.length < searchLength) {
        const searchResult = employeesCtx.employees.filter(employee =>
          Object.values(employee).some(field => field.toString().toLowerCase().includes(target) ||
            Object.values(employee.address).some(field => field.toString().toLowerCase().includes(target))))
        setAllEmployees(searchResult)
        setSearchLength(target.length)
        return
      }

      const searchResult = allEmployees.filter(employee =>
        Object.values(employee).some(field => field.toString().toLowerCase().includes(target) ||
          Object.values(employee.address).some(field => field.toString().toLowerCase().includes(target))))
      setAllEmployees(searchResult)
      setSearchLength(target.length)

    } else {
      setAllEmployees([...employeesCtx.employees])
      setSearchLength(0)
    }
  }
  

  return (
    <div className='view'>
      <div className='view-top'>
        <div className='view-top-select'>
          <SimpleSelectMenu label='Show' options={['10', '25', '50', '100']} log={false} setvalue={changeDisplayNum} init={initSct} />
          entries
        </div>
        <div className='view-top-search'>Search
          <input type='text' placeholder='Search any text or date' onChange={searchData} />
        </div>
      </div>

      <DataTable data={results} start={displayPage * displayNum} />

      <div className='view-bottom'>
        <div>Showing {displayPage + 1} to {pagesArray.length} of {allEmployees.length} entries</div>
        <div>
          {displayPage > 0 && (<Link to="#" onClick={() => selectPage(displayPage - 1)}>Previous</Link>)}
          {
            pagesArray.map((e, i) => {
              if (i === 0) {
                return (<Link to='#' key={i} onClick={() => selectPage(i)} className='page active-page' id={`page-${i + 1}`} >{i + 1}</Link>)
              } else {
                return (<Link to='#' key={i} className='page' id={`page-${i + 1}`} onClick={() => selectPage(i)} >{i + 1}</Link>)
              }
            })
          }
          {displayPage < pagesArray.length - 1 && (<Link to="#" onClick={() => selectPage(displayPage + 1)}>Next</Link>)}
        </div>
      </div>
    </div>
  )
}

export default View