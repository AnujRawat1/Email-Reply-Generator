package com.Email.EmailWriter.controller;

import com.Email.EmailWriter.entity.EmailRequest;
import com.Email.EmailWriter.service.EmailGeneratorService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EmailGeneratorController {

    @Autowired
    private EmailGeneratorService emailGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest) {

        String response = emailGeneratorService.generateEmailReply(emailRequest);
//        if (response == null) {
//            return ResponseEntity.badRequest().body("Error generating email");
//        }
        return ResponseEntity.ok(response);
    }

}
