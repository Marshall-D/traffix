import React from "react";
import classNames from "classnames";
import { ICountPage } from "@/src/types";
import { Button } from "@/src/components/button";
import CountPageHeader from "@/src/components/countPageHeader";
import CountPageHero from "@/src/components/countPageHero";
import { IconButton } from "@/src/components/iconButton";
import { mdiAlphaICircleOutline, mdiPlusCircle, mdiMinusCircle } from "@mdi/js";

const CountPage: React.FC<ICountPage> = () => {
  return (
    <div>
      <CountPageHeader></CountPageHeader>
      <div className="md:hidden  items-center">
        <CountPageHero></CountPageHero>
      </div>
      {/* <div id="count-body">
        <p>current count</p>
        <div>
          <IconButton size={0.8} path={mdiAlphaICircleOutline}></IconButton>{" "}
        </div>
        <IconButton
          size={4}
          path={mdiPlusCircle}
          iconColor="text-primary"
        ></IconButton>{" "}
        <p>0</p>
        <IconButton
          size={4}
          path={mdiMinusCircle}
          iconColor="text-primary"
        ></IconButton>{" "}
      </div> */}
    </div>
  );
};

export default CountPage;
