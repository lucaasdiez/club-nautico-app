package com.clubNautico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ClubNauticoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClubNauticoApplication.class, args);
	}

}
