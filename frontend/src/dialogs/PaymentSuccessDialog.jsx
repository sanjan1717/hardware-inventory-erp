import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
} from "@mui/material";

function PaymentSuccessDialog({
  open,
  onClose,
  onPreview,
  invoiceNo,
  invoiceUrl,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>
        ✅ Payment Successful
      </DialogTitle>

      <DialogContent>
        <Typography align="center" sx={{ mt: 2 }}>
          Invoice Number
        </Typography>

        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
        >
          {invoiceNo}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Stack
          direction="row"
          spacing={2}
          width="100%"
        >
          <Button
  fullWidth
  variant="outlined"
  onClick={() => {
    onClose();
    onPreview();
  }}
>
  Preview Invoice
</Button>

          <Button
            fullWidth
            variant="contained"
            onClick={onClose}
          >
            New Bill
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentSuccessDialog;