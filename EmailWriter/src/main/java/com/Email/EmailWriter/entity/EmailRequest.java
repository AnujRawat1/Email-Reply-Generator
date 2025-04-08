package com.Email.EmailWriter.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Component;


@Component
@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
}
