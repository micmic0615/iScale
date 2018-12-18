"use strict";
import * as React from 'react';
import { Card } from 'antd';
interface Props {
    currentPage: string;
}

export default class PageContent extends React.Component<Props > {
    render() {
        return <Card><div>{this.props.currentPage}</div></Card>
    }
}