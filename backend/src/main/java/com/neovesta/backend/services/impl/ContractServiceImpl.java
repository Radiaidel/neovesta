package com.neovesta.backend.services.impl;

import com.neovesta.backend.dtos.request.ContractRequest;
import com.neovesta.backend.dtos.response.ContractResponse;
import com.neovesta.backend.exceptions.ResourceNotFoundException;
import com.neovesta.backend.mappers.ContractMapper;
import com.neovesta.backend.models.Contract;
import com.neovesta.backend.models.Residence;
import com.neovesta.backend.models.User;
import com.neovesta.backend.models.enums.ContractStatus;
import com.neovesta.backend.models.enums.ContractType;
import com.neovesta.backend.repositories.ContractRepository;
import com.neovesta.backend.repositories.ResidenceRepository;
import com.neovesta.backend.repositories.UserRepository;
import com.neovesta.backend.services.ContractService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.UUID;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.util.List;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final ResidenceRepository residenceRepository;
    private final ContractMapper contractMapper;

    @Override
    @Transactional
    public ContractResponse createContract(ContractRequest request) {
        User resident = userRepository.findResidentById(request.residentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resident not found or does not have the RESIDENT role: " + request.residentId()));

        Residence residence = residenceRepository.findById(request.residenceId())
                .orElseThrow(() -> new ResourceNotFoundException("Residence not found: " + request.residenceId()));

        Contract contract = Contract.builder()
                .resident(resident)
                .residence(residence)
                .startDate(request.startDate())
                .endDate(request.endDate())
                .contractType(request.contractType())
                .status(ContractStatus.ACTIVE)
                .totalAmount(request.totalAmount())
                .paidAmount(request.paidAmount())
                .paymentFrequency(request.paymentFrequency())
                .paymentMethod(request.paymentMethod())
                .contractRules(request.contractRules())
                .build();

        Contract savedContract = contractRepository.save(contract);
        log.info("Contract created: {}", savedContract.getId());

        return contractMapper.toResponse(savedContract);
    }

    @Override
    @Transactional
    public ContractResponse updateContract(UUID id, ContractRequest request) {
        Contract contract = getContract(id);

        User resident = userRepository.findResidentById(request.residentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resident not found or does not have the RESIDENT role: " + request.residentId()));

        Residence residence = residenceRepository.findById(request.residenceId())
                .orElseThrow(() -> new ResourceNotFoundException("Residence not found: " + request.residenceId()));

        contract.setResident(resident);
        contract.setResidence(residence);
        contract.setStartDate(request.startDate());
        contract.setEndDate(request.endDate());
        contract.setContractType(request.contractType());
        contract.setTotalAmount(request.totalAmount());
        contract.setPaidAmount(request.paidAmount());
        contract.setPaymentFrequency(request.paymentFrequency());
        contract.setPaymentMethod(request.paymentMethod());
        contract.setContractRules(request.contractRules());

        Contract updatedContract = contractRepository.save(contract);
        log.info("Contract updated: {}", updatedContract.getId());

        return contractMapper.toResponse(updatedContract);
    }

    @Override
    @Transactional
    public void deleteContract(UUID id) {
        Contract contract = getContract(id);
        contractRepository.delete(contract);
        log.info("Contract deleted: {}", id);
    }

    @Override
    public ContractResponse getContractById(UUID id) {
        return contractMapper.toResponse(getContract(id));
    }

    @Override
    public Page<ContractResponse> getContractsByResident(UUID residentId, Pageable pageable) {
        return contractRepository.findByResidentId(residentId, pageable)
                .map(contractMapper::toResponse);
    }

    @Override
    public Page<ContractResponse> getAllContracts(Pageable pageable) {
        return contractRepository.findAll(pageable)
                .map(contractMapper::toResponse);
    }

    private Contract getContract(UUID id) {
        return contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found: " + id));
    }

    @Override
    public byte[] generateContractPDF(UUID id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + id));

        User resident = userRepository.findResidentById(contract.getResident().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resident not found or does not have the RESIDENT role: " + contract.getResident().getId()));

        Residence residence = residenceRepository.findById(contract.getResidence().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Residence not found"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("CONTRAT DE SERVICE")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontSize(16));

            document.add(new Paragraph("Référence: " + contract.getId().toString())
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setFontSize(10));

            document.add(new Paragraph("\nInformations du résident:")
                    .setBold());
            document.add(new Paragraph("Nom: " + resident.getLastName() + ", " + resident.getFirstName()));
            document.add(new Paragraph("Email: " + resident.getEmail()));
            document.add(new Paragraph("Téléphone: " + resident.getPhoneNumber()));

            document.add(new Paragraph("\nInformations de la résidence:")
                    .setBold());
            document.add(new Paragraph("Nom: " + residence.getName()));
            document.add(new Paragraph("Adresse: " + residence.getAddress()));

            document.add(new Paragraph("\nDétails du contrat:")
                    .setBold());
            document.add(new Paragraph("Type: " + contract.getContractType()));
            document.add(new Paragraph("Statut: " + contract.getStatus()));
            document.add(new Paragraph(
                    "Date de début: " + contract.getStartDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
            document.add(new Paragraph(
                    "Date de fin: " + contract.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
            document.add(new Paragraph("Durée: " + contract.getDurationInMonths() + " mois"));

            document.add(new Paragraph("\nInformations financières:")
                    .setBold());
            document.add(new Paragraph("Montant total: " + contract.getTotalAmount() + " €"));
            document.add(new Paragraph("Montant payé: " + contract.getPaidAmount() + " €"));
            document.add(new Paragraph("Montant restant: " + contract.getRemainingAmount() + " €"));
            document.add(new Paragraph("Fréquence de paiement: " + contract.getPaymentFrequency()));
            document.add(new Paragraph("Méthode de paiement: " + contract.getPaymentMethod()));

            if (contract.getCancellationReason() != null && !contract.getCancellationReason().isEmpty()) {
                document.add(new Paragraph("\nRaison d'annulation: " + contract.getCancellationReason()));
            }

            document.add(new Paragraph("\nRègles du contrat:")
                    .setBold());
            document.add(new Paragraph(contract.getContractRules()));

            document.add(new Paragraph("\n\n\n")
                    .setTextAlignment(TextAlignment.CENTER));

            Table signatureTable = new Table(2);
            signatureTable.addCell(new Cell().add(new Paragraph("Signature du résident:")).setBorder(null));
            signatureTable.addCell(new Cell().add(new Paragraph("Signature du gestionnaire:")).setBorder(null));
            signatureTable.addCell(new Cell().add(new Paragraph("\n\n\n")).setBorder(null));
            signatureTable.addCell(new Cell().add(new Paragraph("\n\n\n")).setBorder(null));
            document.add(signatureTable);

            document.add(new Paragraph("\n\nDocument généré le " +
                    java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(8));

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF for contract: " + id, e);
        }

        return baos.toByteArray();
    }

    @Override
    public byte[] exportContracts(String format) {
        List<Contract> contracts = contractRepository.findAll();

        switch (format.toLowerCase()) {
            case "pdf":
                return generateContractsPDF(contracts);
            case "excel":
                return generateContractsExcel(contracts);
            case "csv":
                return generateContractsCSV(contracts);
            default:
                throw new IllegalArgumentException("Unsupported export format: " + format);
        }
    }

    private byte[] generateContractsPDF(List<Contract> contracts) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("LISTE DES CONTRATS")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontSize(16));

            document.add(new Paragraph("Nombre total de contrats: " + contracts.size())
                    .setTextAlignment(TextAlignment.RIGHT));

            float[] columnWidths = { 1, 2, 2, 1.5f, 1.5f, 1, 1.5f };
            Table table = new Table(columnWidths);

            table.addHeaderCell("ID");
            table.addHeaderCell("Résident");
            table.addHeaderCell("Résidence");
            table.addHeaderCell("Date début");
            table.addHeaderCell("Date fin");
            table.addHeaderCell("Statut");
            table.addHeaderCell("Montant total");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            for (Contract contract : contracts) {
                User resident = userRepository.findResidentById(contract.getResident().getId()).orElse(null);
                Residence residence = residenceRepository.findById(contract.getResidence().getId()).orElse(null);

                table.addCell(contract.getId().toString().substring(0, 8) + "...");
                table.addCell(resident != null ? resident.getLastName() + ", " + resident.getFirstName() : "N/A");
                table.addCell(residence != null ? residence.getName() : "N/A");
                table.addCell(contract.getStartDate().format(formatter));
                table.addCell(contract.getEndDate().format(formatter));
                table.addCell(contract.getStatus().toString());
                table.addCell(contract.getTotalAmount().toString() + " €");
            }

            document.add(table);

            document.add(new Paragraph("\n\nExporté le " +
                    java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(8));

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF for contracts export", e);
        }

        return baos.toByteArray();
    }

    private byte[] generateContractsExcel(List<Contract> contracts) {
        try (Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Contracts");

            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Résident");
            headerRow.createCell(2).setCellValue("Résidence");
            headerRow.createCell(3).setCellValue("Date début");
            headerRow.createCell(4).setCellValue("Date fin");
            headerRow.createCell(5).setCellValue("Durée (mois)");
            headerRow.createCell(6).setCellValue("Type");
            headerRow.createCell(7).setCellValue("Statut");
            headerRow.createCell(8).setCellValue("Montant total");
            headerRow.createCell(9).setCellValue("Montant payé");
            headerRow.createCell(10).setCellValue("Montant restant");
            headerRow.createCell(11).setCellValue("Fréquence paiement");
            headerRow.createCell(12).setCellValue("Méthode paiement");

            int rowNum = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            for (Contract contract : contracts) {
                User resident = userRepository.findResidentById(contract.getResident().getId()).orElse(null);
                Residence residence = residenceRepository.findById(contract.getResidence().getId()).orElse(null);

                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(contract.getId().toString());
                row.createCell(1).setCellValue(
                        resident != null ? resident.getLastName() + ", " + resident.getFirstName() : "N/A");
                row.createCell(2).setCellValue(residence != null ? residence.getName() : "N/A");
                row.createCell(3).setCellValue(contract.getStartDate().format(formatter));
                row.createCell(4).setCellValue(contract.getEndDate().format(formatter));
                row.createCell(5).setCellValue(contract.getDurationInMonths());
                row.createCell(6).setCellValue(contract.getContractType().toString());
                row.createCell(7).setCellValue(contract.getStatus().toString());
                row.createCell(8).setCellValue(contract.getTotalAmount().doubleValue());
                row.createCell(9).setCellValue(contract.getPaidAmount().doubleValue());
                row.createCell(10).setCellValue(contract.getRemainingAmount().doubleValue());
                row.createCell(11).setCellValue(contract.getPaymentFrequency().toString());
                row.createCell(12).setCellValue(contract.getPaymentMethod().toString());
            }

            for (int i = 0; i < 13; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(baos);
            return baos.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Error generating Excel for contracts export", e);
        }
    }

    private byte[] generateContractsCSV(List<Contract> contracts) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            StringBuilder csv = new StringBuilder();

            csv.append(
                    "ID,Résident,Résidence,Date début,Date fin,Durée (mois),Type,Statut,Montant total,Montant payé,Montant restant,Fréquence paiement,Méthode paiement\n");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            for (Contract contract : contracts) {
                User resident = userRepository.findResidentById(contract.getResident().getId()).orElse(null);
                Residence residence = residenceRepository.findById(contract.getResident().getId()).orElse(null);

                csv.append(contract.getId().toString()).append(",");
                csv.append(
                        escapeCsv(resident != null ? resident.getLastName() + ", " + resident.getFirstName() : "N/A"))
                        .append(",");
                csv.append(escapeCsv(residence != null ? residence.getName() : "N/A")).append(",");
                csv.append(contract.getStartDate().format(formatter)).append(",");
                csv.append(contract.getEndDate().format(formatter)).append(",");
                csv.append(contract.getDurationInMonths()).append(",");
                csv.append(contract.getContractType().toString()).append(",");
                csv.append(contract.getStatus().toString()).append(",");
                csv.append(contract.getTotalAmount()).append(",");
                csv.append(contract.getPaidAmount()).append(",");
                csv.append(contract.getRemainingAmount()).append(",");
                csv.append(contract.getPaymentFrequency().toString()).append(",");
                csv.append(contract.getPaymentMethod().toString()).append("\n");
            }

            baos.write(csv.toString().getBytes());

        } catch (Exception e) {
            throw new RuntimeException("Error generating CSV for contracts export", e);
        }

        return baos.toByteArray();
    }

    private String escapeCsv(String value) {
        if (value == null)
            return "";
        if (value.contains("\"") || value.contains(",")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    // Implémenter cette méthode dans votre classe ContractServiceImpl
    @Override
    public Page<ContractResponse> getAllContractsWithFilters(
            UUID residentId, UUID residenceId, ContractType contractType, ContractStatus status,
            LocalDate startDateFrom, LocalDate startDateTo, LocalDate endDateFrom, LocalDate endDateTo,
            Pageable pageable) {

        // Créer une spécification pour filtrer les contrats
        Specification<Contract> spec = Specification.where(null);

        if (residentId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("residentId"), residentId));
        }

        if (residenceId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("residenceId"), residenceId));
        }

        if (contractType != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("contractType"), contractType));
        }

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        if (startDateFrom != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("startDate"), startDateFrom));
        }

        if (startDateTo != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("startDate"), startDateTo));
        }

        if (endDateFrom != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("endDate"), endDateFrom));
        }

        if (endDateTo != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("endDate"), endDateTo));
        }

        // Exécuter la requête avec la spécification et la pagination
        Page<Contract> contracts = contractRepository.findAll(spec, pageable);

        // Convertir les entités en DTOs
        return contracts.map(contractMapper::toResponse);
    }

}