import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import styles from "./dialog.module.css"
import { ENTER_GAME } from '../../redux/game/actions';
import { useHistory } from 'react-router-dom';
import { CHANGE_AMOUNT } from '../../redux/user/actions';

export default function AlertDialog({open, setOpen}) {
  const dispatch = useDispatch()  
  const history = useHistory()
  const room = useSelector(s=>s.room.selectedRoom)
  const user = useSelector(s=>s.user)

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = (room) => {
    dispatch(CHANGE_AMOUNT(-room.buyIn))
    dispatch(ENTER_GAME({room, user}))
    history.push(`/game/${room.id}`)
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
        >
        <DialogTitle className={styles.dialog} id="alert-dialog-title"><div className={styles.title} >{"Tournament Registration"}</div></DialogTitle>
        <DialogContent className={styles.dialog} >
            <div className={styles.roomInfo} >
                <span>{room.roomName}</span>
                <span>{room.buyIn}</span>
            </div>
        </DialogContent>
        <DialogActions className={styles.dialog} >
            <div className={styles.buttons}  >
          <Button
          style={{ backgroundColor: "green", color: "#FFF", fontSize: "20px" }}
          onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: "green", color: "#FFF", fontSize: "20px" }}
            onClick={()=>{handleConfirm(room)}} color="primary" autoFocus>
            confirm
          </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
