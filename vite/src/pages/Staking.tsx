import { FC } from "react";

const poolData = [
  {
    name: "btc",
    img: "",
    value: 124000717,
    volume: 1091270,
    APR: 1.29,
  },
  {
    name: "eth",
    img: "",
    value: 124000717,
    volume: 1091270,
    APR: 1.29,
  },
  {
    name: "bnb",
    img: "",
    value: 124000717,
    volume: 1091270,
    APR: 1.29,
  },
  {
    name: "sol",
    img: "",
    value: 124000717,
    volume: 1091270,
    APR: 1.29,
  },
  {
    name: "xrp",
    img: "",
    value: 124000717,
    volume: 1091270,
    APR: 1.29,
  },
  {
    name: "doge",
    img: "",
    value: 124000717,
    volume: 1091270,
    APR: 1.29,
  },
  {
    name: "ton",
    img: "",
    value: 124000717,
    volume: 1091270,
    APR: 1.29,
  },
  {
    name: "ada",
    img: "",
    value: 124000717,
    volume: 1091270,
    APR: 1.29,
  },
  {
    name: "avax",
    img: "",
    value: 124000717,
    volume: 1091270,
    APR: 1.29,
  },
  {
    name: "trx",
    img: "",
    value: 124000717,
    volume: 1091270,
    APR: 1.29,
  },
];

const Staking: FC = () => {
  return (
    <div className="m-8 h-lvh bg-red-100">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div>Staking</div>
          <div>Claim</div>
        </div>
        <button>create a pool</button>
      </div>
      <div className="bg-blue-100 h-full">
        <table className="w-full whitespace-normal table-fixed">
          <colgroup>
            <col className="w-[125px]" />
            <col className="w-[350px]" />
            <col className="w-[150px]" />
            <col className="w-[175px]" />
            <col className="w-[150px]" />
          </colgroup>
          <thead className="z-10 text-white bg-gray-800">
            <th className="p-6">
              <div className="flex justify-start">
                <h5>Pool</h5>
              </div>
            </th>
            <th className="p-6">
              <div className="flex justify-start">
                <div>
                  <h5>Composition</h5>
                </div>
              </div>
            </th>
            <th className="p-6">
              <div className="flex justify-end">
                <div>
                  <h5>Pool value</h5>
                </div>
                <div className="inline-block bal-icon flex items-center ml-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="feather feather-arrow-down"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                </div>
              </div>
            </th>
            <th className="p-6">
              <div className="flex justify-end">
                <div>
                  <h5>Volume (24h)</h5>
                </div>
              </div>
            </th>
            <th className="p-6">
              <div className="flex justify-end">
                <div>
                  <h5>APR</h5>
                </div>
              </div>
            </th>
          </thead>
          <tr>
            <td className="text-right horizontalSticky bg-white dark:bg-gray-850 p-0 m-0 h-0"></td>
            <td className="text-right bg-white dark:bg-gray-850 p-0 m-0 h-0"></td>
            <td className="text-left bg-white dark:bg-gray-850 p-0 m-0 h-0"></td>
            <td className="text-left bg-white dark:bg-gray-850 p-0 m-0 h-0"></td>
            <td className="text-left bg-white dark:bg-gray-850 p-0 m-0 h-0"></td>
          </tr>
          {poolData.map((v, i) => (
            <tr className="cursor-pointer">
              <td className="p-6">
                <img src={v.img} />
              </td>
              <td className="flex gap-2 p-6">
                <div>usdt</div>
                <div>{v.name}</div>
              </td>
              <td className="text-right p-6">${v.value}</td>
              <td className="text-right p-6">${v.volume}</td>
              <td className="text-right p-6">{v.APR}%</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default Staking;
