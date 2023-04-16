import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { useRouter } from "next/router";

import {
  BiBall,
  BiBookContent,
  BiChalkboard,
  BiChevronRight,
  BiFontFamily,
  BiImages,
  BiMusic,
  BiSlideshow,
  BiData,
  BiStoreAlt,
  BiBrain,
  BiUser,
  BiUserPlus,
  BiUserCircle,
  BiCategory,
} from "react-icons/bi";
import { TbLanguageHiragana } from "react-icons/tb";
import { MdOutlineLanguage } from "react-icons/md";

import styles from "./Navbar.module.scss";
import { useAppDispatch, useAppSelector, useTrans } from "../../store/hooks";
import { setNavActive } from "../../store/slice/controlSlice";
import { Tooltip } from "antd";
const cx = classNames.bind(styles);

function Navbar() {
  const navList = [
    {
      id: 2,
      title: "Quản lý IOT",
      url: "/iot",
      icon: <MdOutlineLanguage />,
      role: [],
      sub: [],
    },
    {
      id: 2,
      title: "Quản lý cell",
      url: "/cell",
      icon: <BiBrain />,
      role: [],
      sub: [],
    },

    // {
    //   id: 7,
    //   title: "Viết Content thông minh",
    //   url: "/chat",
    //   icon: <BiBrain />,
    //   role: [],
    //   sub: [],
    // },
  ];

  const { isNavActive } = useAppSelector((state) => state.control);
  const { user } = useAppSelector((state) => state.login);
  const dispatch = useAppDispatch();
  const { pathname, push } = useRouter();
  const [listSubNavActive, setListSubNavActive] = useState<number>(0);

  const handleGoPage = (navItem: any) => {
    if (navItem.sub.length > 0) {
      if (!isNavActive) dispatch(setNavActive(!isNavActive));
      if (navItem.id === listSubNavActive) {
        setListSubNavActive(0);
        return;
      }
      setListSubNavActive(navItem.id);
      return;
    }
    push(navItem.url);
  };

  const handleGoPageSub = (subItem: any) => {
    if (subItem.url === pathname) return;
    push(subItem.url);
  };

  const checkRole = (requiredRole: string[], userRole: string[]): boolean => {
    if (requiredRole.length === 0) return true;
    for (let i = 0; i < requiredRole.length; i++) {
      if (userRole.includes(requiredRole[i])) return true;
    }
    return false;
  };
  return (
    <>
      <>
        <div
          className={`${
            isNavActive ? "fixed" : "hidden"
          } tablet:hidden w-screen h-screen bg-[#00000075]  top-0 left-0 z-50 `}
          style={{ backdropFilter: "blur(5px)" }}
          onClick={() => dispatch(setNavActive(!isNavActive))}
        ></div>
        <div
          className={`${cx(
            "nav",
            `${isNavActive ? "nav--active" : ""}`
          )} fixed top-0 left-0 translate-x-[-100%] ${
            isNavActive ? "translate-x-[0]" : ""
          } tablet:translate-x-[0] tablet:relative z-50`}
        >
          <div className={cx("nav-container")}>
            <div
              className={cx("nav-logo")}
              onClick={() => dispatch(setNavActive(!isNavActive))}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={cx("nav-logo_small")}
                src="/vfast-video.png"
                alt="logo vfast"
              />
            </div>
            <nav>
              <ul>
                {navList.map((item) => {
                  return (
                    <li
                      key={item.id}
                      onClick={() => handleGoPage(item)}
                      className={cx(`${pathname == item.url ? "active" : ""}`)}
                    >
                      <Tooltip
                        placement="left"
                        title={!isNavActive ? item.title : ""}
                      >
                        <div className={cx("nav-icon")}>{item.icon}</div>
                      </Tooltip>
                      <span className={cx("nav-title")}>{item.title}</span>

                      {item.sub.length > 0 && isNavActive && (
                        <BiChevronRight
                          className={`
                                                                ${
                                                                  listSubNavActive ==
                                                                    item.id &&
                                                                  cx(
                                                                    "icon-sub--active"
                                                                  )
                                                                }`}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </>
    </>
  );
}

export default Navbar;
