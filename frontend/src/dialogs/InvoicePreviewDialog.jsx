import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function InvoicePreviewDialog({
  open,
  onClose,
  invoiceUrl,
  invoiceNo,
}) {
  const handlePrint = () => {
    const iframe = document.getElementById("invoiceFrame");

    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: "95vw",
          height: "95vh",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#374151",
          color: "white",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          📄 Invoice Preview
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography fontWeight={600}>
            {invoiceNo}
          </Typography>

          <IconButton color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          overflow: "hidden",
        }}
      >
        <iframe
          id="invoiceFrame"
          src={`${invoiceUrl}#toolbar=0`}
          title="Invoice"
          width="100%"
          height="100%"
          style={{
            border: "none",
            minHeight: "78vh",
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#374151",
          borderTop: "1px solid #4b5563",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            borderRadius: 3,
            px: 4,
            textTransform: "none",
          }}
        >
          Print
        </Button>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          component="a"
          href={invoiceUrl}
          download
          sx={{
            borderRadius: 3,
            textTransform: "none",
          }}
        >
          Download
        </Button>

        <Button
          color="inherit"
          startIcon={<CloseRoundedIcon />}
          onClick={onClose}
          sx={{
            textTransform: "none",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InvoicePreviewDialog;