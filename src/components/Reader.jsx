import {useEffect, useState} from "react";
import {Helmet} from "react-helmet";

export default function Reader (props) {

    const [currentElection, setCurrentElection] = useState("2020_pres")
    const [elections, setElections] = useState({})
    const [rawTotals, setRawTotals] = useState({"R": 0, "D": 0, "T": 0})
    const [lastTotals, setLastTotals] = useState({"R": 0, "D": 0, "T": 0})

    const [stateCode, setStateCode] = useState("")
    const [countyName, setCountyName] = useState("")
    const [blockFips, setBlockFips] = useState(0)

    const [message, setMessage] = useState("")

    const [serverUrl, setServerUrl] = useState("5.161.86.174:5000")

    const [electionSelect, setElectionSelect] = useState(<div></div>)

    useEffect(() => {
        if ("geolocation" in navigator) {
            setInterval(() => {fetchInfo()}, 1500)
        }
    }, [])

    const getDiff = (r, d) => {
        let dp = (d / (r + d)) * 100
        let rp = (r / (r + d)) * 100

        let diff = dp - rp
        return [(diff >= 0 ? "D" : "R")+ "+" + Math.abs(diff).toFixed(2), diff]
    }

    const getColor = (amount) => {
        let backgroundColor = "";
        let color = "";

        if (amount >= 0) {

            if (amount <= 1) {
                backgroundColor = "#D3E7FF";
            } else if (amount <= 4) {
                backgroundColor = "#b9d7ff"
            } else if (amount <= 8) {
                backgroundColor = "#86b6f6"
            } else if (amount <= 12) {
                backgroundColor = "#4389e3"
                color = "white"
            } else if (amount <= 16) {
                backgroundColor = "#1666cb"
                color = "white"
            } else if (amount <= 21) {
                backgroundColor = "#0645b4"
                color = "white"
            } else {
                backgroundColor = "#002B84"
                color = "white"
            }
        } else {
            amount = amount * -1;
            if (amount <= 1) {
                backgroundColor = "#ffccd0";
            } else if (amount <= 4) {
                backgroundColor = "#f2b3be"
            } else if (amount <= 8) {
                backgroundColor = "#e27f90"
            } else if (amount <= 12) {
                backgroundColor = "#cc2f4a"
                color = "white"
            } else if (amount <= 16) {
                backgroundColor = "#d40000"
                color = "white"
            } else if (amount <= 21) {
                backgroundColor = "#aa0000"
                color = "white"
            } else if (amount <= 30) {
                backgroundColor = "#800000"
                color = "white"
            }
        }

        return {
            backgroundColor: backgroundColor,
            color: color
        }

    }

    const getLastElection = (election) => {

        let matchingElections = Object.keys(elections).filter((e) =>
            (e.split("_")[1] === election.split("_")[1] && parseInt(e.split("_")[0]) < parseInt(election.split("_")[0])))

        console.log(matchingElections)
        if(matchingElections.length === 0) return ""

        let lastElectionNumber = Math.max( matchingElections.map((e) => parseInt(e.split("_")[0])))

        return lastElectionNumber + "_" + election.split("_")[1]
    }

    const fetchInfo = () => {

        const that = this
        navigator.geolocation.getCurrentPosition(function (position) { // Get location

            var request = "https://geo.fcc.gov/api/census/area?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&censusYear=2020";

            fetch(request)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.results.length > 0) {

                        //that.setState({
                        //    blockFips: responseJson.results.at(0).block_fips,
                        //    countyName: responseJson.results.at(0).county_name,
                        //    stateCode: responseJson.results.at(0).state_code
                        //});

                        setBlockFips(responseJson.results.at(0).block_fips)
                        setCountyName(responseJson.results.at(0).county_name)
                        setStateCode(responseJson.results.at(0).state_code)

                    }
                })
        })
    }

    useEffect(() => {
        if (!stateCode) return
        setMessage(elections[currentElection] + ", " + countyName)
    }, [elections, currentElection, countyName])

    // Get election data for block FIPS
    useEffect(() => {
        if (!stateCode) return
        if (Object.keys(elections).length === 0) return

        let election_request = "https://" + serverUrl
            + "/electiondata?election=" + currentElection
            + "&blockfips=" + blockFips
            + "&statecode=" + stateCode;

        fetch(election_request)
            .then((response) => response.json())
            .then((responseJson) => {
                for (let key of Object.keys(responseJson)) {
                    setRawTotals(prev => ({
                            ...prev,
                            [key[0]]: parseInt(responseJson[key])
                    }))
                }
            })

        console.log(currentElection)
        if (getLastElection(currentElection)) {
            let last_election_request = "http://" + serverUrl
                + "/electiondata?election=" + getLastElection(currentElection)
                + "&blockfips=" + blockFips
                + "&statecode=" + stateCode;

            fetch(last_election_request)
                .then((response) => response.json())
                .then((responseJson) => {
                    for (let key of Object.keys(responseJson)) {

                        setLastTotals(prev => ({
                            ...prev,
                            [key[0]]: parseInt(responseJson[key])
                        }))
                    }
                })

        } else {
            setLastTotals({
                "R": 0,
                "D": 0,
                "T": 0
            })
        }

    }, [blockFips, currentElection, elections])

    // Changes (or generates) the elections in the dataset for a given state
    useEffect(() => {
        let electionsRequest = "http://" + serverUrl + "/elections?statecode=" + stateCode;

        fetch(electionsRequest)
            .then((response) => response.json())
            .then((responseJson) => {
                setCurrentElection("2020_pres")
                setElections(responseJson)
            })
    }, [stateCode])

    /**
    useEffect(() => {
        setElectionSelect(<div>
            <select
                id={"select"}
                name={"select-election"}
                onChange={e => setCurrentElection(e.target.value)}
                value={currentElection}>
                {Object.keys(elections).map((election) => {
                    return (
                        <option value={election} key={election}>{elections[election]}</option>
                    )
                })}
            </select>
        </div>)
    }, [elections])
        **/

    useEffect(() => {
        setElectionSelect(<div style={{display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
            {Object.keys(elections).map((election) => {
                return (
                    <button onClick={() => setCurrentElection(election)} key={election} style={{padding: (currentElection === election) ? ("0px") : ("5px")}}>{elections[election]}</button>
                )
            })}
        </div>)
    }, [elections])

    return (
            ((rawTotals["D"] === 0) ? message :

                <div style={{margin: "auto", color: getColor(getDiff(rawTotals["R"], rawTotals["D"])[1])["color"]}}>
                    <Helmet>
                        <style>{'body { background-color: ' + getColor(getDiff(rawTotals["R"], rawTotals["D"])[1])["backgroundColor"] + '; }'}</style>
                    </Helmet>

                    <p>{electionSelect}</p>
                    <p>{message}</p>
                    <p>{getDiff(rawTotals["R"], rawTotals["D"])[0]}</p>
                    {((shift) => {
                        if (shift === 0 || lastTotals["D"] === 0) return <div> Swing not available </div>
                        return (
                            <div
                                style={{backgroundColor: getColor(shift)["backgroundColor"]}}>
                                <p style={{color: getColor(shift)["color"]}}>
                                    {"Swung " + Math.abs(shift).toPrecision(2) + " points " + (shift <= 0 ? "right" : "left")}
                                </p>
                            </div>
                        )
                    })(getDiff(rawTotals["R"], rawTotals["D"])[1] - getDiff(lastTotals["R"], lastTotals["D"])[1])}
                </div>)
    )

}