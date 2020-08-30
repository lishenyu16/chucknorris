import React, { Component, useEffect, useState } from 'react';
// import { Switch, Route, Redirect, Link ,useHistory} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import './App.css';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const useStyles = makeStyles({
  header: {
    width: '100%',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
  },
  mainDiv: {
    width: '100%',
    display:'flex',
    flexDirection:'column',
    alignItems: 'center',
    padding: '5% 10%'
  },
  itemDiv: {
    cursor: 'pointer',
    backgroundColor: 'lightgray',
    '&:hover': {
      backgroundColor: 'grey',
    },
  },
  root: {
    margin: '0'
  },
  closeButton: {
    position: 'absolute',
    right: '5px',
    top: '5px',
    color: 'gray',
  },
  inline: {
    display: 'inline',
    padding: '5px 30px'
  },
  operations: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '20px'
  }
});

const App = () => {
  const [open,setOpen] = useState(false);
  const [jokes,setJokes] = useState([]);
  const [currentJoke, setCurrentJoke] = useState(null);
  const [loading, setLoading] = useState(false);
	const classes = useStyles();
  // let history = useHistory();
  useEffect(()=>{
   const fetchChucks = async () => {
     try {
       const data = await axios.get('http://api.icndb.com/jokes/random/15');
       setJokes(data.data.value);
     }
     catch(err){
      console.log(err);
     }
   } 
   fetchChucks();
  },[])

  async function fetchRandomJokes() {
    const data = await axios.get('http://api.icndb.com/jokes/random/15');
    setJokes(data.data.value);
  }
  async function fetchRandomJokesWithDelay() {
    setLoading(true);
    const data = await axios.get('http://api.icndb.com/jokes/random/15');
    setTimeout(()=>{
      setJokes(data.data.value);
      setLoading(false);
    }, 2000)
  }

  function toggleModal() {
    setOpen(!open);
  }

  function clickItem(item) {
    setCurrentJoke(item);
    toggleModal()
  }

	return (
    <div className={classes.mainDiv}>
      <div className={classes.header}>Chuck Norris</div>
      <div className={classes.operations}>
        <Button onClick={fetchRandomJokes} style={{marginRight: '20px'}} variant="contained" color="primary">
          Random Jokes
        </Button>
        <Button onClick={fetchRandomJokesWithDelay} variant="contained" color="primary">
          Delayed Random Jokes
        </Button>
      </div>
      <div style={{position: 'relative'}}>
        {loading?
          <CircularProgress style={{position: 'absolute', zIndex: '10', top: '50%', left: '50%'}} />
        :null}
        <List className={classes.root}>
          {jokes.map(item => {
            return (
            <div key={item.id} className={classes.itemDiv} onClick={()=>clickItem(item)}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {item.joke.slice(0,30)}...
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
            </div>)
          })}
        </List>
      </div>
      {open?
      <Dialog onClose={toggleModal} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={toggleModal}>
          Joke No.{currentJoke.id}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {currentJoke.joke}
          </Typography>
        </DialogContent>
      </Dialog>
      :null}
    </div>
	)
}

export default App

