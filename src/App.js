import React, { Component } from "react";
import "./App.css";
import { Sidenav, Nav, Icon, Dropdown, Row } from "rsuite";
import Sidebar from "react-sidebar";
import { Document, Page, pdfjs, Outline } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      sidebarOpen: false,
      numPages: null,
      pageNumber: 1,
      outlineData: []
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }
  onDocumentLoadSuccess = pdf => {
    this.setState({
      numPages: pdf.numPages,
      pdf: pdf
    });
  };

  goToPrevPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
  goToNextPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber + 1 }));
  outlineItemClick = page => {
    console.log(page);
    this.setState({
      pageNumber: page.pageNumber
    });
  };

  onOutlineSuccess = outlineData => {
    console.log(outlineData);
    this.setState({
      outlineData: outlineData
    });
  };

  onSetSidebarOpen(open) {
    // console.log(open);
    this.setState({ sidebarOpen: open });
  }
  onpageloadsuccess = page => {
    //  console.log(page.view);
  };
  onGetAnnotationsSuccess = annotations => {
    console.log(annotations);
  };
  onGetTextSuccess = items => {
    console.log(items);
  };
  render() {
    const { pageNumber, numPages, pdf, outlineData } = this.state;

    return (
      <div>
        <Document
          file="/PDFViewer/Web Design for Developers.pdf"
          pdf={pdf}
          onLoadSuccess={this.onDocumentLoadSuccess}
          onItemClick={this.outlineItemClick}
        >
          <Sidebar
            expanded={false}
            sidebar={
              <Outline
                onLoadSuccess={this.onOutlineSuccess}
                onItemClick={this.outlineItemClick}
              />
            }
            open={this.state.sidebarOpen}
            docked={false}
            styles={{ sidebar: { background: "white", zIndex: 100 } }}
            onSetOpen={this.onSetSidebarOpen}
          >
            <div className="pdfContainer">
              {" "}
              <button
                style={{ backgroundColor: "lightblue" }}
                onClick={() => this.onSetSidebarOpen(true)}
              >
                <h6>Open Document Outline</h6>
              </button>
              <div style={{ marginLeft: "10%", width: 250 }}>
                <Sidenav defaultOpenKeys={["3", "4"]} activeKey="1">
                  <Sidenav.Body>
                    <Nav>
                      {outlineData.map((entry, index) => {
                        if (entry.items.length == 0) {
                          return (
                            <Nav.Item
                              //componentClass="navitemclass"
                              eventKey={index}
                              icon={<Icon icon="dashboard" />}
                            >
                              {entry.title}
                            </Nav.Item>
                          );
                        } else {
                          return (
                            <Dropdown
                              eventKey={index}
                              title={entry.title}
                              icon={<Icon icon="dashboard" />}
                            >
                              {entry.items.map(item => {
                                return (
                                  <Dropdown.Item>{item.title}</Dropdown.Item>
                                );
                              })}
                            </Dropdown>
                          );
                        }
                      })}
                    </Nav>
                  </Sidenav.Body>
                </Sidenav>
              </div>
              <div className="pageDisplay">
                <nav>
                  <button onClick={this.goToPrevPage}>Prev</button>
                  <button onClick={this.goToNextPage}>Next</button>
                </nav>
                <Page
                  onGetTextSuccess={this.onGetTextSuccess}
                  renderAnnotationLayer={true}
                  renderInteractiveForms={true}
                  onGetAnnotationsSuccess={this.onGetAnnotationsSuccess}
                  onLoadSuccess={this.onpageloadsuccess}
                  pageNumber={pageNumber}
                />
                <p>
                  Page {pageNumber} of {numPages}
                </p>
              </div>
            </div>
          </Sidebar>
        </Document>
      </div>
    );
  }
}

export default App;
