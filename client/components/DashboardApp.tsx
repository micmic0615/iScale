"use strict";
import * as React from 'react';

import Layout from 'antd/lib/layout';
import 'antd/lib/layout/style/css';

import Menu from 'antd/lib/menu';
import 'antd/lib/menu/style/css';

import Breadcrumb from 'antd/lib/breadcrumb';
import 'antd/lib/breadcrumb/style/css';

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

import { PAGE_REPORTS, PAGE_OPTION_2, PAGE_USER, PAGE_TEAM, PAGE_FILE } from '../../constants/pageNames';
import PageReports from './PageReports';
import PageDefault from './PageDefault';
import startCase from 'lodash/startCase';


const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class DashboardApp extends React.Component {
  state = {
    collapsed: false,
    currentPage: PAGE_REPORTS,
    subPage: "",
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" onClick={()=>{this.setState({currentPage: PAGE_REPORTS}) }}>
              <Icon type="pie-chart" />
              <span>Reports</span>
            </Menu.Item>
            <Menu.Item key="2" onClick={()=>{this.setState({currentPage: PAGE_OPTION_2}) }}>
              <Icon type="desktop" />
              <span>Option 2</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span>User</span></span>}
              
            >
              <Menu.Item key="3" onClick={()=>{this.setState({currentPage: PAGE_USER, subPage:"Tom" }) }}>Tom</Menu.Item>
              <Menu.Item key="4" onClick={()=>{this.setState({currentPage: PAGE_USER, subPage:"Bill" }) }}>Bill</Menu.Item>
              <Menu.Item key="5" onClick={()=>{this.setState({currentPage: PAGE_USER, subPage:"Alex" }) }}>Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><Icon type="team" /><span>Team</span></span>}
            >
              <Menu.Item key="6" onClick={()=>{this.setState({currentPage: PAGE_TEAM, subPage:"Team 1" }) }}>Team 1</Menu.Item>
              <Menu.Item key="8" onClick={()=>{this.setState({currentPage: PAGE_TEAM, subPage:"Team 2" }) }}>Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" onClick={()=>{this.setState({currentPage: PAGE_FILE}) }}>
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} >
            <b style={{marginLeft:"20px", fontSize:"22px", color:"#000"}}>{startCase(this.state.currentPage.toLowerCase().replace("page_", ""))}</b>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>{startCase(this.state.currentPage.toLowerCase().replace("page_", ""))}</Breadcrumb.Item>
              <Breadcrumb.Item>
                {(()=>{
                  switch(this.state.currentPage){
                    case PAGE_REPORTS: 
                      return "Message Receipts & Optins";
                    
                    case PAGE_USER: 
                    case PAGE_TEAM: 
                      return this.state.subPage;
                  
                    default:
                      return ""
                }
                })()}
              
              </Breadcrumb.Item>
            </Breadcrumb>
           
            {(()=>{
              switch(this.state.currentPage){
                case PAGE_REPORTS: 
                  return <PageReports />
                
                default:
                  return <PageDefault currentPage={this.state.currentPage} />
            }
            })()}
          </Content>
          <Footer style={{ textAlign: 'center' }}>ShopMessage ©2018</Footer>
        </Layout>
      </Layout>
    );
  }
}