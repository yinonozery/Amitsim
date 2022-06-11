import { CircularProgress, Box, Typography, } from "@material-ui/core";


const CircularProgressWithLabel = (props) => {
  return (
    <div>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          thickness={6}
          size={110}
          style={{
            color: 'var(--clr-neutral-500)',
            position: 'absolute',
            left: '0'
          }}
        />



        <CircularProgress
          variant="determinate"
          value={Math.round(props.value)}
          thickness={6}
          size={110}
          style={{
            color: 'steelblue',
            position: 'relative'
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="subtitle1" component="div" >
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

export default CircularProgressWithLabel;