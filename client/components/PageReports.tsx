"use strict";
import * as React from 'react';
import { Fragment } from 'react';
import { Card, DatePicker, Switch } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { Chart } from "react-charts";


const { RangePicker } = DatePicker;

const styleOptionsFirstRow = {
    marginRight: "20px"
}

const dateFormat = "YYYY-MM-DD";


export default class PageContent extends React.Component {
    state = {
        startDate: moment("2018-10-01", dateFormat),
        endDate: moment("2018-11-01", dateFormat),
        dataOptins: [],
        dataRecipients: [],
        queryStatusOptins: "none",
        queryStatusRecipients: "none",
        displayOptins: true,
        displayRecipients: true,
    }

    componentDidMount(){
        this.queryData.bind(this)();
    }

    dataCleaner(data){
        let year = parseInt(this.state.startDate.format("YYYY"));
        let monthDay = this.state.startDate.format("MM/DD");
        if (monthDay == "01/01"){year -= 1};
        
        return data.map((item)=>{
            if (item.date == "01/01"){year += 1}
            return [moment(item.date + "/" + year, "MM/DD/YYYY") , item.count]
        })
    }

    queryData(){
        let endDate = moment(this.state.endDate)
        let dateString = "from="+this.state.startDate.format(dateFormat)+'&to=' + endDate.add(1, "days").format(dateFormat);
        axios.get('/api/reports/optins.json?'+ dateString)
        .then((response)=>{
            this.setState({dataOptins: this.dataCleaner(response.data), queryStatusOptins: "done"})
        })
        .catch((error)=>{
            this.setState({dataOptins: [], queryStatusOptins: "error"})
        })

        axios.get('/api/reports/recipients.json?'+ dateString)
        .then((response)=>{
            this.setState({dataRecipients:  this.dataCleaner(response.data), queryStatusRecipients: "done"})
        })
        .catch((error)=>{
            this.setState({dataRecipients: [], queryStatusRecipients: "error"})
        })
    }

    render() { 
        let lineGraphData = [
            {
                label: 'Optins',
                color: "#e33",
                opacity: this.state.displayOptins ? 1 : 0,
                data: this.state.dataOptins 
            },
            {
                label: 'Recipients',
                color: "#3ee",
                opacity: this.state.displayRecipients ? 1 : 0,
                data: this.state.dataRecipients 
            }
        ]

        return <Fragment>
            <Card>
                <table style={{width: "500px"}}>
                    <tbody>
                        <tr>
                            <td style={styleOptionsFirstRow}>Date Range: </td>
                            <td style={{display:"flex", flexDirection:"row"}}> 
                                <RangePicker 
                                    size={"small"} 
                                    value={[this.state.startDate, this.state.endDate]}
                                    onChange={(momentValue, stringValue)=>{
                                        this.setState({startDate: momentValue[0], endDate:momentValue[1]}, this.queryData.bind(this))
                                    }}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td style={styleOptionsFirstRow}>Show Optins: </td>
                            <td> <Switch size={"small"} checked={this.state.displayOptins} onChange={(checked)=>{this.setState({displayOptins: checked})}} /> </td>
                        </tr>

                        <tr>
                            <td style={styleOptionsFirstRow}>Show Recipients: </td>
                            <td> <Switch size={"small"} checked={this.state.displayRecipients} onChange={(checked)=>{this.setState({displayRecipients: checked})}} /> </td>
                        </tr>
                    </tbody>
                </table>
            </Card>

            <Card style={{marginTop:"20px"}}>
                <table style={{marginBottom:"20px"}}>
                    <tbody>
                        {lineGraphData.map((item)=>{
                            return <tr>
                                <td><div style={{backgroundColor:item.color, marginRight:"5px", width: "16px", height:"16px", borderRadius:"50%"}}></div></td>
                                <td>{item.label}</td>
                            </tr>
                        })}
                    </tbody>
                </table>

                <div
                    style={{
                        width: "100%",
                        height: "360px"
                    }}
                >
              
                    <Chart
                        data={ lineGraphData }
                        primaryCursor
                        tooltip

                        getSeriesStyle={(series)=>{
                            return {
                                color: series.originalSeries.color,
                                opacity: series.originalSeries.opacity
                            }
                        }}

                        axes={[
                            { primary: true, type: "time", position: "bottom", format: "MM/DD" },
                            { type: "linear", position: "left" }
                        ]}

                    />

                </div>
            </Card>
        </Fragment>}
}