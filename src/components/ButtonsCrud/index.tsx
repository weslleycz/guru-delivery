import { api } from "@/services/apí";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button } from "@mui/material";
import { getCookie } from "cookies-next";
import { ExportToCsv } from "export-to-csv";
import { Notify, notifySuccess,notifyError } from "../Notify";

type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    type: string;
    img: string;
    discount: string;
    cartId: string;
    restaurantId: string;
    orderId: string;
};

type Props = {
    rowSelection: {};
    data: Product[];
    columns: any;
    refetch: any;
    setRowSelection:any;
};

export const ButtonsCrud = ({
    rowSelection,
    data,
    columns,
    refetch,
    setRowSelection
}: Props) => {
    const handleDeactivate = async () => {
        const token = getCookie("@tokenAdmin");
        console.clear();
        Object.keys(rowSelection).map(async (index, axi, array) => {
            try {
                api.delete(`/product/${data[Number(index)].id}`, {
                    headers: {
                        Authorization: token,
                    },
                });
                notifySuccess("Apagado com sucesso");
            } catch (error) {
                notifyError("Ocorreu um erro inesperado")
            }
        });
        refetch();
        setRowSelection({})
    };

    const csvOptions = {
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: columns.map((c: { header: any }) => c.header),
    };

    const csvExporter = new ExportToCsv(csvOptions);

    const handleExportData = () => {

        csvExporter.generateCsv(data);
    };

    return (
        <div style={{ display: "flex", gap: "0.6rem" }}>
            <Notify />
            <Button
                disabled={
                    Object.keys(rowSelection)[0] != undefined ? false : true
                }
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeactivate()}
                variant="contained"
            >
                Deletar
            </Button>
            <Button
                disabled={Object.keys(rowSelection).length === 1 ? false : true}
                color="info"
                startIcon={<CreateIcon />}
                variant="contained"
            >
                Editar
            </Button>
            <Button
                color="inherit"
                disabled={data.length != 0 ? false : true}
                startIcon={<FileDownloadIcon />}
                variant="contained"
                onClick={() => handleExportData()}
            >
                Exportar
            </Button>
        </div>
    );
};
