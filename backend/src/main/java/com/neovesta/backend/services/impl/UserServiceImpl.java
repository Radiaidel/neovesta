package com.neovesta.backend.services.impl;

import com.neovesta.backend.dtos.request.CreateUserRequest;
import com.neovesta.backend.dtos.request.UpdateUserRequest;
import com.neovesta.backend.dtos.request.UserSearchRequest;
import com.neovesta.backend.dtos.response.UserResponse;
import com.neovesta.backend.exceptions.ResourceNotFoundException;
import com.neovesta.backend.exceptions.UnauthorizedException;
import com.neovesta.backend.mappers.UserMapper;
import com.neovesta.backend.models.Admin;
import com.neovesta.backend.models.Contract;
import com.neovesta.backend.models.Residence;
import com.neovesta.backend.models.ResidenceManager;
import com.neovesta.backend.models.Resident;
import com.neovesta.backend.models.SubResidenceManager;
import com.neovesta.backend.models.SuperAdmin;
import com.neovesta.backend.models.User;
import com.neovesta.backend.models.enums.Role;
import com.neovesta.backend.repositories.UserRepository;
import com.neovesta.backend.security.UserDetailsImpl;
import com.neovesta.backend.services.CloudinaryService;
import com.neovesta.backend.services.UserService;
import com.neovesta.backend.utils.AuthenticationFacade;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        User newUser;

        switch (request.getRole()) {
            case ADMIN:
                newUser = Admin.builder()
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .phoneNumber(request.getPhoneNumber())
                        .role(Role.ADMIN)
                        .build();
                break;

            case SUPER_ADMIN:
                newUser = SuperAdmin.builder()
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .phoneNumber(request.getPhoneNumber())
                        .role(Role.SUPER_ADMIN)
                        .build();
                break;

            case RESIDENCE_MANAGER:
                newUser = ResidenceManager.builder()
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .phoneNumber(request.getPhoneNumber())
                        .role(Role.RESIDENCE_MANAGER)
                        .build();
                break;

            case SUB_RESIDENCE_MANAGER:
                ResidenceManager manager = userRepository.findById(request.getManagerId())
                        .filter(user -> user.getRole() == Role.RESIDENCE_MANAGER)
                        .map(user -> (ResidenceManager) user)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid Residence Manager ID."));

                newUser = SubResidenceManager.builder()
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .phoneNumber(request.getPhoneNumber())
                        .manager(manager)
                        .role(Role.SUB_RESIDENCE_MANAGER)
                        .build();
                break;

            case RESIDENT:
                newUser = Resident.builder()
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .phoneNumber(request.getPhoneNumber())
                        .role(Role.RESIDENT)
                        .build();
                break;

            default:
                throw new IllegalArgumentException("Unsupported role: " + request.getRole());
        }

        return userMapper.toResponse(userRepository.save(newUser));
    }

    @Override
    public UserResponse getUserById(UUID id) {
        return userRepository.findById(id)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    // @Override
    // public Page<UserResponse> searchUsers(UserSearchRequest request) {
    // PageRequest pageRequest = PageRequest.of(request.getPage(),
    // request.getSize());
    // return userRepository.searchUsers(
    // request.getSearchTerm(),
    // pageRequest).map(userMapper::toResponse);
    // }

    @Override
    public Page<UserResponse> getUsersByRole(Role role, int page, int size) {
        return userRepository.findByRole(role, PageRequest.of(page, size))
                .map(userMapper::toResponse);
    }

    @Override
    public UserResponse updateUser(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());

        if (request.getProfilePicture() != null && !request.getProfilePicture().isEmpty()) {
            try {
                if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().isEmpty()) {
                    cloudinaryService.deleteImage(user.getProfilePictureUrl());
                }

                String imageUrl = cloudinaryService.uploadImage(request.getProfilePicture());
                user.setProfilePictureUrl(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to process profile picture", e);
            }
        }

        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updatePassword(UUID id, String currentPassword, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public void toggleUserStatus(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setStatus(!user.isStatus());
        userRepository.save(user);
    }

    @Override
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteUserWithCascade(id);
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    public Page<UserResponse> getAllUsers(int page, int size) {
        Page<User> users = userRepository.findAll(PageRequest.of(page, size));
        return users.map(userMapper::toResponse);
    }

    @Override
    public String uploadProfileImage(UUID id, MultipartFile profileImage) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String imageUrl = cloudinaryService.uploadImage(profileImage);

        if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().isEmpty()) {
            try {
                cloudinaryService.deleteImage(user.getProfilePictureUrl());
            } catch (Exception e) {
                log.error("Error deleting old profile image", e);
            }
        }

        user.setProfilePictureUrl(imageUrl);
        userRepository.save(user);

        return imageUrl;
    }

    @Override
    public Page<UserResponse> searchUsers(String searchTerm, Role role, int page, int size) {
        User currentUser = getCurrentUser();
        Specification<User> spec = buildSearchSpecification(searchTerm, role, currentUser);
        Pageable pageable = PageRequest.of(page, size);
        System.out.println(userRepository.findAll(spec, pageable).map(userMapper::toResponse));
        return userRepository.findAll(spec, pageable).map(userMapper::toResponse);
    }

    private Specification<User> buildSearchSpecification(String searchTerm, Role role, User currentUser) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            List<Predicate> rolePredicates = new ArrayList<>();

            // Filtre de recherche
            if (!searchTerm.isEmpty()) {
                String term = "%" + searchTerm.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("email")), term),
                        cb.like(cb.lower(root.get("firstName")), term),
                        cb.like(cb.lower(root.get("lastName")), term)));
            }

            // Filtre hiérarchique
            switch (currentUser.getRole()) {
                case SUPER_ADMIN:
                    rolePredicates.add(cb.equal(root.type(), Admin.class));
                    rolePredicates.add(cb.equal(root.type(), ResidenceManager.class));
                    break;
                case ADMIN:
                    rolePredicates.add(cb.equal(root.type(), ResidenceManager.class));
                    break;

                    case RESIDENCE_MANAGER:
                    ResidenceManager residenceManager = (ResidenceManager) currentUser;
                    UUID residenceId = residenceManager.getResidence().getId();
                    
                    // Prédicats pour les sous-managers
                    Predicate subManagerPredicate = cb.and(
                        cb.equal(root.type(), SubResidenceManager.class),
                        cb.equal(root.get("role"), Role.SUB_RESIDENCE_MANAGER)
                    );
                    
                    // Joindre la table SubResidenceManager pour vérifier le manager_id
                    Subquery<UUID> subManagerQuery = query.subquery(UUID.class);
                    Root<SubResidenceManager> subManagerRoot = subManagerQuery.from(SubResidenceManager.class);
                    subManagerQuery.select(subManagerRoot.get("id"));
                    subManagerQuery.where(cb.equal(subManagerRoot.get("manager").get("id"), residenceManager.getId()));
                    
                    // Pour les résidents via contrats
                    Subquery<UUID> residentQuery = query.subquery(UUID.class);
                    Root<Contract> contractRoot = residentQuery.from(Contract.class);
                    residentQuery.select(contractRoot.get("resident").get("id"));
                    residentQuery.where(cb.equal(contractRoot.get("residence").get("id"), residenceId));
                    
                    Predicate residentPredicate = cb.and(
                        cb.equal(root.type(), Resident.class),
                        cb.equal(root.get("role"), Role.RESIDENT),
                        root.get("id").in(residentQuery)
                    );
                    
                    // Combiner les prédicats
                    rolePredicates.add(cb.or(
                        cb.and(subManagerPredicate, root.get("id").in(subManagerQuery)),
                        residentPredicate
                    ));
                    break;
                
                case SUB_RESIDENCE_MANAGER:
                    SubResidenceManager subManager = (SubResidenceManager) currentUser;
                    ResidenceManager manager = subManager.getManager();
                    UUID managerResidenceId = manager.getResidence().getId();
                    
                    // Pour les résidents via contrats - identique à la logique du RESIDENCE_MANAGER
                    Subquery<UUID> subResidentQuery = query.subquery(UUID.class);
                    Root<Contract> subContractRoot = subResidentQuery.from(Contract.class);
                    subResidentQuery.select(subContractRoot.get("resident").get("id"));
                    subResidentQuery.where(cb.equal(subContractRoot.get("residence").get("id"), managerResidenceId));
                    
                    Predicate subResidentPredicate = cb.and(
                        cb.equal(root.type(), Resident.class),
                        cb.equal(root.get("role"), Role.RESIDENT),
                        root.get("id").in(subResidentQuery)
                    );
                    
                    rolePredicates.add(subResidentPredicate);
                    break;
                
                default:
                    return cb.disjunction();
            }

            // Combiner les prédicats de rôle
            if (!rolePredicates.isEmpty()) {
                predicates.add(cb.or(rolePredicates.toArray(new Predicate[0])));
            }

            // Filtre par rôle supplémentaire
            if (role != null) {
                predicates.add(cb.equal(root.get("role"), role));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private User getCurrentUser() {
        Authentication authentication = authenticationFacade.getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Chargez l'entité complète avec les relations
        return userRepository.findById(userDetails.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

}