package com.flightmanagement.service;

import com.flightmanagement.dto.AccountDto;
import com.flightmanagement.dto.RegisterDto;
import com.flightmanagement.entity.Account;

import java.util.List;

// AccountService.java (Interface)
public interface AccountService {
    AccountDto createAccount(RegisterDto dto);

    AccountDto getAccountById(Integer id);

    AccountDto getAccountByEmail(String email);

    Account getAccountByName(String accountName);

    List<AccountDto> getAllAccounts();

    AccountDto updateAccount(Integer id, AccountDto dto);

    void deleteAccount(Integer id);

    boolean existsByEmail(String email);

    List<AccountDto> getAccountsByType(Integer accountType);

    boolean verifyCurrentPassword(Integer accountId, String currentPassword);
    void resetPassword(Integer accountId, String currentPassword, String newPassword);
}


