import { useState } from 'react';
import { Container, Typography, TextField, Box, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress } from '@mui/material'; // Assuming you are using Material-UI
import axios from 'axios';
import './App.css';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {

      const response = await axios.post("https://smart-email-reply-generator.onrender.com/api/email/generate", {emailContent, tone});
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data)); 
      
    } catch (error) {

      setError("Failed to generate reply . Please Try Again");
      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ px: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Smart Email Reply Generator
      </Typography>


      <Box sx={{mx:3}}>

        <TextField fullWidth multiline rows={7} variant='outlined' label="Original Email Content"
        onChange={(e) => setEmailContent(e.target.value) }
        />

        <FormControl fullWidth sx={{mt: 2, mb:2}}>
          <InputLabel>Tone (Optional)</InputLabel>

          <Select value = {tone || '' } label={"Tone (Optional)"} onChange={(e) => setTone(e.target.value) }>
            <MenuItem value="Professtional">Professtional</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
            <MenuItem value="">None</MenuItem>
          </Select>
        </FormControl>


        <Button variant='contained' onClick={handleSubmit} disabled={!emailContent || loading} fullWidth>
          {loading ? <CircularProgress size={24} /> : "Generate Reply" } 
        </Button>
      </Box>


      {error && (
        <Typography color='error' sx={{mb:2, mt:2}}>
          {error}
        </Typography>
      )}


      {generatedReply && (
        <Box sx={{mt:3}} >
          <Typography variant='h5' fontWeight={700} color='grey' gutterBottom>
            Generated Reply
          </Typography>

          <TextField fullWidth multiline rows={10} variant='outlined' value={generatedReply || ''} inputProps={{readOnly:true}}></TextField>

          <Button variant='outlined' sx={{mt:2}} onClick={() => navigator.clipboard.writeText(generatedReply)}>Copy to Clipboard</Button>
        </Box>
      )}
    </Container>
  );
}

export default App;
