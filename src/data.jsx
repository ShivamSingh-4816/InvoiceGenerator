import { AiOutlineSetting } from "react-icons/ai";
import { FaFileInvoiceDollar, FaUserCheck } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { HiUsers, HiViewGrid } from "react-icons/hi";
import { MdInventory2, MdMobileScreenShare, MdPreview, MdBarChart } from "react-icons/md";
import { FaQrcode } from "react-icons/fa";


export const linksData = [
  {
    title: "Overview",
    linkItems: [
      {
        name: "Dashboard",
        icon: <GoHome />,
        link: "/dashboard",
      },
      {
        name: "Create Invoice",
        icon: <FaFileInvoiceDollar />,
        link: "/create-invoice",
      },
      {
        name: "Invoice Generator",
        icon: <FaQrcode />,
        link: "/InvoiceGenerator",
      },
      {
        name: "Inventory Scan Form",
        icon: <MdInventory2 />,
        link: "/InventoryForm",
      },
      {
        name: "Preview Invoice",
        icon: <MdPreview />,
        link: "/form-preview",
      },
      {name: "Analysis",
        icon: <MdBarChart />,
        link: "/InventoryChart",
      },
      {
        name: "See All Invoice",
        icon: <HiViewGrid />,
        link: "/invoice-history",
      },
      {
        name: "Share Invoice",
        icon: <MdMobileScreenShare />,
        link: "/share-invoice",
      },
      {
        name: "My clients",
        icon: <HiUsers />,
        link: "/my-clients",
      },
    ],
  },
  {
    title: "Others",
    linkItems: [
      {
        name: "Settings",
        icon: <AiOutlineSetting />,
        link: "/settings"
      },
      {
        name: "Subscription",
        icon: <FaUserCheck />,
      },
    ],
  },
];
