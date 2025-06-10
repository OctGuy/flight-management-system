package com.flightmanagement.service;

import com.flightmanagement.dto.CustomerDto;

import java.util.List;

public interface CustomerService {
    CustomerDto getCustomerById(Integer id);

    List<CustomerDto> getAllCustomers();

    CustomerDto createCustomer(CustomerDto dto);

    CustomerDto updateCustomer(Integer id, CustomerDto dto);

    void deleteCustomer(Integer id);

    CustomerDto getCustomerByEmail(String email);

    CustomerDto updateCustomerScore(Integer id, Integer score);

    Integer getCustomerScore(Integer id);
}
