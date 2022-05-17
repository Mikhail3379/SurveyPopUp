import React, { useEffect, useMemo, useState } from "react";
import DashboardIcon from "../../icons/DashboardIcon";
import AssetIcon from "../../icons/AssetIcon";
import StrategiesIcon from "../../icons/StrategiesIcon";
import MonitoringIcon from "../../icons/MonitoringIcon";
import ApproveAdminIcon from "../../icons/ApproveAdminIcon";
import StatisticsIcon from "../../icons/StatisticsIcon";
import NovaIcon from "../../icons/NovaIcon";
import PortfolioIcon from "../../icons/PortfolioIcon";
import { v4 } from "uuid";
import { SERVER_URLAnaytics } from "../../pages/utils";
import axios from "axios";
import store from "../../redux/store";
import "./Sidebar.css";
import iconAnalytics from "../../images/welcome.png";
import { Link } from "react-router-dom";
import logoNova from "../../images/sideBarIcons/NovaLogo.svg";
import { clusterApiUrl } from "../../config/configCluster";
import { MAINNET } from "../../pages/WalletUtils";
import { adminTestControl } from "../../NToken-solana-module/portfolio/adminAccess";
import { Connection } from "@solana/web3.js";
import SendReportPopup from "../../components/popup";
import HelpModal from "../../components/popup/help";
export default function Sidebar(props: any) {
  const perfData = window.performance.timing;
  const [sidebar, setSidebar] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const network = props.network;
  const networkUrl = clusterApiUrl(network);
  const connection = useMemo(() => new Connection(networkUrl), [networkUrl]);
  const [isOpen, setIsOpen] = useState(false);
  /**New Modal***/
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  /******* */
  function existAdmin() {
    adminTestControl(
      connection,
      store.getState().account.adress,
      (error, result: any) => {
        if (error) {
          console.log(error);
          setisAdmin(false);
        } else {
          setisAdmin(result === "true");
        }
      }
    );
  }
  const toggleSendReport = () => setIsOpen(false);

  async function saveAnalyticsPage() {
    let identifiant = v4();
    var body = {
      idUser: store.getState().account.adress,
      id: identifiant,
      connectStart: perfData.connectStart,
      connectEnd: perfData.connectEnd,
      pageUrl: window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1,
        window.location.href.length
      ),
    };
    localStorage.setItem("identifiant", identifiant);

    axios
      .post(
        SERVER_URLAnaytics + "/saveData",

        body
      )
      .then(
        (data) => {},
        (err) => {
          console.log("saveData ws", err);
        }
      );
  }

  useEffect(() => {
    existAdmin();
    if (
      window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1,
        window.location.href.length
      ) != "analytics"
    ) {
      saveAnalyticsPage();
    }
  }, [isAdmin]);

  const isActive = (path: string) => {
    return props.pathname.includes(path);
  };

  return (
    <div style={{ overflowY: "scroll" }} className="SidebarComponent">
      <SendReportPopup isOpen={isOpen} toggle={toggleSendReport} />
      {isModalOpen && (
        <HelpModal
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          errText=""
        />
      )}
      <img src={logoNova} className="logoNova" alt="" />
      <div className="list">
        <ul className="SidebarList">
          <li hidden={network == MAINNET}>
            <Link to="/nova/FaucetForTest">
              <div
                className={
                  isActive("/nova/FaucetForTest") ? "isActive" : "isNotActive"
                }
              >
                <img className="sidebarIcon" src={iconAnalytics} />

                <span className="title ">Welcome to devnet</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/nova/DashboardAssetsdata" onClick={handleOpenModal}>
              <div
                className={
                  isActive("/nova/DashboardAssetsdata")
                    ? "isActive"
                    : "isNotActive"
                }
              >
                <DashboardIcon
                  className="sidebarIcon"
                  isActive={isActive("/nova/DashboardAssetsdata")}
                />
                <span className="title">Dashboard</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/nova/portfolio">
              <div
                className={
                  isActive("/nova/portfolio") ? "isActive" : "isNotActive"
                }
              >
                <PortfolioIcon
                  className="sidebarIcon"
                  isActive={isActive("/nova/portfolio")}
                />
                <span className="title">Portfolio</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/nova/Novatoken">
              <div
                className={
                  isActive("/nova/Novatoken") ? "isActive" : "isNotActive"
                }
              >
                <NovaIcon
                  className="sidebarIcon"
                  isActive={isActive("/nova/Novatoken")}
                />
                <span className="title novaTitle">Nova</span>
              </div>
            </Link>
          </li>
          <li onClick={showSidebar} hidden={!isAdmin}>
            <Link to="/nova/administration/ListAsset">
              <div
                className={
                  isActive("/nova/administration") ? "isActive" : "isNotActive"
                }
              >
                <DashboardIcon
                  className="sidebarIcon"
                  isActive={isActive("/nova/administration")}
                />
                <span className="title">Administration</span>
              </div>
            </Link>
          </li>
          {sidebar ? (
            <li>
              <ul>
                <li>
                  <Link to="/nova/administration/ListAsset">
                    <div
                      className={
                        isActive("/nova/administration/ListAsset")
                          ? "isActive"
                          : "isNotActive"
                      }
                    >
                      <AssetIcon
                        className="sidebarIcon"
                        isActive={isActive("/nova/administration/ListAsset")}
                      />
                      <span className="title">Assets</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/nova/administration/ListStrategy">
                    <div
                      className={
                        isActive("/nova/administration/ListStrategy")
                          ? "isActive"
                          : "isNotActive"
                      }
                    >
                      <StrategiesIcon
                        className="sidebarIcon"
                        isActive={isActive("/nova/administration/ListStrategy")}
                      />
                      <span className="title">Strategies</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/nova/administration/ListMonitoring">
                    <div
                      className={
                        isActive("/nova/administration/ListMonitoring")
                          ? "isActive"
                          : "isNotActive"
                      }
                    >
                      <MonitoringIcon
                        className="sidebarIcon"
                        isActive={isActive(
                          "/nova/administration/ListMonitoring"
                        )}
                      />
                      <span className="title">Monitoring</span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link to="/nova/administration/approveAdmin">
                    <div
                      className={
                        isActive("/nova/administration/approveAdmin")
                          ? "isActive"
                          : "isNotActive"
                      }
                    >
                      <ApproveAdminIcon
                        className="sidebarIcon"
                        isActive={isActive("/nova/administration/approveAdmin")}
                      />
                      <span className="title">Approve Admin</span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link to="/nova/administration/analytics">
                    <div
                      className={
                        isActive("/nova/administration/analytics")
                          ? "isActive"
                          : "isNotActive"
                      }
                    >
                      <StatisticsIcon
                        className="sidebarIcon"
                        isActive={isActive("/nova/administration/analytics")}
                      />
                      <span className="title">Statistics</span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link to="/nova/administration/logs">
                    <div
                      className={
                        isActive("/nova/administration/logs")
                          ? "isActive"
                          : "isNotActive"
                      }
                    >
                      <MonitoringIcon
                        className="sidebarIcon"
                        isActive={isActive("/nova/administration/logs")}
                      />
                      <span className="title">Logs</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </li>
          ) : (
            <></>
          )}
          <svg
            onClick={props.toggleSideBar}
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            fill="currentColor"
            className="bi bi-chevron-bar-left toggleSideBar"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0zM4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5z"
            />
          </svg>
        </ul>

        <i
          className="bi bi-chevron-bar-up toggleSideBar"
          onClick={props.toggleSideBar}
        ></i>

        <div className="sidebarFooter">
          <a href="https://twitter.com/NovaFinance_" target="_blank">
            Twitter
          </a>
          <a href="https://novafinance.app/whitepaper/" target="_blank">
            Docs
          </a>
          <a href="https://discord.gg/WYVUSn56ac" target="_blank">
            Discord
          </a>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => /* openForm()*/ setIsOpen(true)}
          >
            Send Report
          </span>
        </div>
      </div>
    </div>
  );
}
