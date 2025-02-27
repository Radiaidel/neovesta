package com.neovesta.backend.dtos.response;

import lombok.Data;

@Data
public class AddressResponse {
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private Double latitude;
    private Double longitude;
}
