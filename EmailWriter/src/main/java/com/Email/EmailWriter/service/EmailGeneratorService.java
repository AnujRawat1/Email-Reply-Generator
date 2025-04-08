package com.Email.EmailWriter.service;

import com.Email.EmailWriter.entity.EmailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Autowired
    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
//.baseUrl("https://api.gemini.com/v1/")
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String generateEmailReply(EmailRequest emailRequest) {

        // Build a Prompt
        String prompt = buildPrompt(emailRequest);

        // Craft a Request to API
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of( "parts" , new Object[] {
                                Map.of( "text", prompt )
                        } )
                }
        );

        // Request to API & Get Response
        String respponse = webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Parse the Response
        return extractResponse(respponse);
    }

    private String extractResponse(String respponse) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(respponse);
            return rootNode
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText();
        }catch (Exception e){
//            throw new RuntimeException("Error while processing the response : "+e.getMessage());
            return  "Error while processing the response : "+e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional reply for the following email. Please don't generate the subject line. : \n");
        if (emailRequest.getTone() != null && !emailRequest.getTone().trim().isEmpty() ) {
            prompt.append("Please Use a ").append(emailRequest.getTone()).append(" Tone for the Email Reply");
        }

        prompt.append("\n\nOriginal Email : \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }

}
