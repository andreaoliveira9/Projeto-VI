import React, { useEffect, useRef, useState } from "react";
import { useData } from "../../contexts/data.jsx";
import information from "./information.json";
import { DEFAULT_MARGIN } from "../../utils/utils.js";
import { Modal } from "../../components/modal/index.js";
import { Card } from "../../components/card/index.js";
import { ResponsiveWrapper } from "../../components/responsiveWrapper/index.js";
import { LinePlot } from "../../components/plot/inovation/linePlot/index.js";
import { HistogramPlot } from "../../components/plot/inovation/histogramPlot/index.js";
import { ScatterPlotPRD } from "../../components/plot/inovation/ScatterPlotPRD/index.js";
import { ScatterPlotCUS } from "../../components/plot/inovation/ScatterPlotCUS/index.js";

export const Inovation = (props) => {
  const [sectors, setSectors] = useState([]);
  const [years, setYears] = useState([]);
  const [sector, setSector] = useState("all");
  const [country, setCountry] = useState("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [modal, setModal] = useState({ title: "", content: "" });

  const sectorRef = useRef(null);
  const countryRef = useRef(null);
  const startRef = useRef(null);
  const endRef = useRef(null);

  const { data } = useData();
  const [filteredData, setFilteredData] = useState(data);

  const clearFilters = () => {
    setSector("all");
    setCountry("all");
    setStart("");
    setEnd("");
    setFilteredData(data);
    sectorRef.current.value = "all";
    countryRef.current.value = "all";
    startRef.current.value = "";
    endRef.current.value = "";
  };

  const filterBySector = (row) =>
    sector == "all" || row["Tech Sector"] == sector;

  const filterByCountry = (row) => country == "all" || row.Country == country;

  const filterByStart = (row) => start == "" || parseInt(row.Year) >= start;

  const filterByEnd = (row) => end == "" || parseInt(row.Year) <= end;

  const filterData = () =>
    data &&
    setFilteredData(() =>
      data.filter(
        (row) =>
          filterBySector(row) &&
          filterByCountry(row) &&
          filterByStart(row) &&
          filterByEnd(row),
        []
      )
    );

  useEffect(() => {
    filterData();
  }, [sector, country, start, end]);

  useEffect(() => {
    if (data) {
      const uniqueSectors = Array.from(
        new Set(data.map((item) => item["Tech Sector"]))
      );
      setSectors(uniqueSectors);

      const uniqueYears = Array.from(
        new Set(data.map((item) => item.Year))
      ).sort((a, b) => b - a);
      setYears(uniqueYears);
    }
    setFilteredData(() => data);
  }, [data]);

  return (
    <div
      className={
        "grid grid-cols-10 h-full gap-x-4 lg:overflow-y-hidden gap-y-2 lg:gap-y-0 mx-2"
      }
      id={"container"}
    >
      <div className={"col-span-full lg:col-span-2"}>
        <div className={"card bg-[#345d7e] rounded-lg shadow-lg"}>
          <div className={"card-body"}>
            <div className={"card-title mx-auto text-3xl text-white"}>
              Filtros
            </div>
            <div className={"flex flex-col gap-4 m-5"}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-lg text-white">
                    Setor
                  </span>
                </label>
                <select
                  className="select select-bordered border-none bg-white text-[#345d7e]"
                  onChange={(e) => setSector(e.target.value)}
                  ref={sectorRef}
                >
                  <option value="all">Todos</option>
                  {sectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector == "AI"
                        ? "IA"
                        : sector == "Biotechnology"
                        ? "Biotecnologia"
                        : sector == "Cloud Computing"
                        ? "Computação em Nuvem"
                        : sector == "Robotics"
                        ? "Robótica"
                        : sector == "Semiconductor"
                        ? "Semicondutores"
                        : sector == "Telecommunications"
                        ? "Telecomunicações"
                        : sector}
                    </option>
                  ))}
                </select>

                <label className="label">
                  <span className="label-text font-bold text-lg text-white">
                    País
                  </span>
                </label>
                <select
                  className="select select-bordered border-none bg-white text-[#345d7e]"
                  onChange={(e) => setCountry(e.target.value)}
                  ref={countryRef}
                >
                  <option value={"all"}>Todos</option>
                  <option value={"China"}>China</option>
                  <option value={"Japan"}>Japão</option>
                </select>

                <label className="label">
                  <span className="label-text font-bold text-lg text-white">
                    Desde
                  </span>
                </label>
                <select
                  className="select select-bordered border-none bg-white text-[#345d7e]"
                  onChange={(e) => setStart(e.target.value)}
                  ref={startRef}
                >
                  <option value=""></option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <label className="label">
                  <span className="label-text font-bold text-lg text-white">
                    Até
                  </span>
                </label>
                <select
                  className="select select-bordered border-none bg-white text-[#345d7e]"
                  onChange={(e) => setEnd(e.target.value)}
                  ref={endRef}
                >
                  <option value=""></option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className={
                  "btn btn-block bg-[#e63946] hover:bg-[#b22d34] text-white font-bold rounded-lg"
                }
                onClick={clearFilters}
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          "col-span-full lg:col-span-8 grid grid-cols-4 lg:overflow-y-auto gap-2 pb-3"
        }
      >
        {(country == "all" || country == "China") && (
          <Card
            title={"Ranking Global Médio de Inovação por Setor por Ano - China"}
            info={information[0]}
            setModal={setModal}
          >
            <ResponsiveWrapper>
              {({ width, height }) => (
                <LinePlot
                  allData={data}
                  data={filteredData}
                  country={"China"}
                  width={width}
                  height={height}
                  margin={DEFAULT_MARGIN}
                />
              )}
            </ResponsiveWrapper>
          </Card>
        )}
        {(country == "all" || country == "Japan") && (
          <Card
            title={"Ranking Global Médio de Inovação por Setor por Ano - Japão"}
            info={information[0]}
            setModal={setModal}
          >
            <ResponsiveWrapper>
              {({ width, height }) => (
                <LinePlot
                  allData={data}
                  data={filteredData}
                  country={"Japan"}
                  width={width}
                  height={height}
                  margin={DEFAULT_MARGIN}
                />
              )}
            </ResponsiveWrapper>
          </Card>
        )}
        {(country == "all" || country == "China") && (
          <Card
            title={"Colaborações Universitárias e Patentes - China"}
            info={information[0]}
            setModal={setModal}
          >
            <ResponsiveWrapper>
              {({ width, height }) => (
                <HistogramPlot
                  data={filteredData}
                  country={"China"}
                  width={width}
                  height={height}
                  margin={DEFAULT_MARGIN}
                />
              )}
            </ResponsiveWrapper>
          </Card>
        )}
        {(country == "all" || country == "Japan") && (
          <Card
            title={"Colaborações Universitárias e Patentes - Japão"}
            info={information[0]}
            setModal={setModal}
          >
            <ResponsiveWrapper>
              {({ width, height }) => (
                <HistogramPlot
                  data={filteredData}
                  country={"Japan"}
                  width={width}
                  height={height}
                  margin={DEFAULT_MARGIN}
                />
              )}
            </ResponsiveWrapper>
          </Card>
        )}
        <Card
          title={"Colaborações Universitárias e Patentes"}
          info={information[0]}
          setModal={setModal}
        >
          <ResponsiveWrapper>
            {({ width, height }) => (
              <ScatterPlotCUS
                data={filteredData}
                width={width}
                height={height}
                margin={DEFAULT_MARGIN}
              />
            )}
          </ResponsiveWrapper>
        </Card>
        <Card
          title={"Investimento em R&D e Número de Patentes"}
          info={information[0]}
          setModal={setModal}
        >
          <ResponsiveWrapper>
            {({ width, height }) => (
              <ScatterPlotPRD
                data={filteredData}
                width={width}
                height={height}
                margin={DEFAULT_MARGIN}
              />
            )}
          </ResponsiveWrapper>
        </Card>
        <Modal title={modal.title} content={modal.content} />
      </div>
    </div>
  );
};
